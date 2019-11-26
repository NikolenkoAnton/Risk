function checkParameters() {
    account = 'riskdeskstorage';
    sas = '?sv=2018-03-28&ss=b&srt=sco&sp=rwdlac&se=2020-04-07T22:55:30Z&st=2019-04-07T14:55:30Z&spr=https&sig=yiMaA2sUwPRFYFnjv8aMuy4p2Qyrd9rvwfrI2rl5iDY%3D';

    if (account == null || account.length < 1) {
        alert('Please enter a valid storage account name!');
        return false;
    }
    if (sas == null || sas.length < 1) {
        alert('Please enter a valid SAS Token!');
        return false;
    }

    return true;
}

function getBlobService() {
    if (!checkParameters())
        return null;

    blobUri = 'https://' + account + '.blob.core.windows.net';
    console.log(AzureStorage.Blob);
    console.log(AzureStorage);
    var blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, sas).withFilter(new AzureStorage.Blob.ExponentialRetryPolicyFilter());
    return blobService;
}

function refreshContainer() {
    var blobService = getBlobService();
    if (!blobService)
        return;

    //document.getElementById('containers').innerHTML = 'Loading...';
    blobService.listContainersSegmented(null, function (error, results) {
        if (error) {
            alert('List container error, please open browser console to view detailed error');
            console.log(error);
        } else {
            var output = [];
            output.push('<tr>',
                '<th>ContainerName</th>',
                '<th>ContainerETag</th>',
                '<th>LastModified</th>',
                '<th>Operations</th>',
                '</tr>');
            if (results.entries.length < 1) {
                output.push('<tr><td>Empty results...</td></tr>');
            }
            for (var i = 0, container; container = results.entries[i]; i++) {
                output.push('<tr>',
                    '<td>', container.name, '</td>',
                    '<td>', container.etag, '</td>',
                    '<td>', container.lastModified, '</td>',
                    '<td>', '<button class="btn btn-xs btn-danger" onclick="deleteContainer(\'', container.name, '\')">Delete</button> ',
                    '<button class="btn btn-xs btn-success" onclick="viewContainer(\'', container.name, '\')">Select</button>', '</td>',
                    '</tr>');
            }

            //document.getElementById('containers').innerHTML = '<table class="table table-condensed table-bordered">' + output.join('') + '</table>';
        }
    });
}

function deleteContainer(name) {
    var blobService = getBlobService();
    if (!blobService)
        return;

    blobService.deleteContainerIfExists(name, function (error, result) {
        if (error) {
            alert('Delete container failed, open browser console for more detailed info.');
            console.log(error);
        } else {
            alert('Delete ' + name + ' successfully!');
            refreshContainer();
        }
    });
}

function createContainer() {
    var blobService = getBlobService();
    if (!blobService)
        return;

    var container = document.getElementById('newcontainer').value;
    if (!AzureStorage.Blob.Validate.containerNameIsValid(container, function (err, res) { })) {
        alert('Invalid container name!');
        return;
    }

    blobService.createContainerIfNotExists(container, function (error, result) {
        if (error) {
            alert('Create container failed, open browser console for more detailed info.');
            console.log(error);
        } else {
            alert('Create ' + container + ' successfully!');
            refreshContainer();
        }
    });
}

function viewContainer(selectedContainer) {
    container = selectedContainer;
    document.getElementById('container').value = container;
    alert('Selected ' + container + ' !');
    refreshBlobList();
}

function refreshBlobList() {
    var blobService = getBlobService();
    if (!blobService)
        return;

    document.getElementById('result').innerHTML = 'Loading...';
    blobService.createContainerIfNotExists(container, function (error, result) {
        if (error) {
            alert('createContainerIfNotExists error, please open browser console to view detailed error');
            console.log(error);
        } else {
            blobService.listBlobsSegmented(container, null, function (error, results) {
                if (error) {
                    alert('List blob error, please open browser console to view detailed error');
                    console.log(error);
                } else {
                    var output = [];
                    output.push('<tr>',
                        '<th>BlobName</th>',
                        '<th>ContentLength</th>',
                        '<th>LastModified</th>',
                        '<th>Operations</th>',
                        '</tr>');
                    if (results.entries.length < 1) {
                        output.push('<tr><td>Empty results...</td></tr>');
                    }
                    for (var i = 0, blob; blob = results.entries[i]; i++) {
                        output.push('<tr>',
                            '<td>', blob.name, '</td>',
                            '<td>', blob.contentLength, '</td>',
                            '<td>', blob.lastModified, '</td>',
                            '<td>', '<button class="btn btn-xs btn-danger" onclick="deleteBlob(\'', blob.name, '\')">Delete</button> ',
                            '<a class="btn btn-xs btn-success" href="', blobUri + '/' + container + '/' + blob.name + sas, '" download>Download</a>', '</td>',
                            '</td>',
                            '</tr>');
                    }
                    document.getElementById('result').innerHTML = '<table class="table table-condensed table-bordered">' + output.join('') + '</table>';
                }
            });
        }
    })
}

function deleteBlob(blob) {
    var blobService = getBlobService();
    if (!blobService)
        return;

    blobService.deleteBlobIfExists(container, blob, function (error, result) {
        if (error) {
            alert('Delete blob failed, open browser console for more detailed info.');
            console.log(error);
        } else {
            alert('Delete ' + blob + ' successfully!');
            refreshBlobList();
        }
    });
}

function displayProcess(process) {
    document.getElementById('progress').style.width = process + '%';
    document.getElementById('progress').innerHTML = process + '%';
}

function uploadBlobByStream(checkMD5) {
    var files = document.getElementById('files').files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }
    var file = files[0];
    //file = file + ".csv";
    var blobService = getBlobService();
    if (!blobService)
        return;

    //var btn = document.getElementById('upload-button');
    //btn.disabled = true;
    //btn.innerHTML = 'Uploading';

    // Make a smaller block size when uploading small blobs
    var blockSize = file.size > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
    var options = {
        storeBlobContentMD5: checkMD5,
        blockSize: blockSize
    };
    blobService.singleBlobPutThresholdInBytes = blockSize;

    var finishedOrError = false;
    var speedSummary = blobService.createBlockBlobFromBrowserFile(container, file.name, file, options, function (error, result, response) {
        finishedOrError = true;
        //btn.disabled = false;
        //btn.innerHTML = 'UploadBlob';
        if (error) {
            alert('Upload failed, open browser console for more detailed info.');
            console.log(error);
            displayProcess(0);
        } else {
            displayProcess(100);
            setTimeout(function () { // Prevent alert from stopping UI progress update
                alert('Upload successfully!');
            }, 1000);
            //refreshBlobList();
        }
    });

    //speedSummary.on('progress', function () {
    //    var process = speedSummary.getCompletePercent();
    //    displayProcess(process);
    //});
}
// New Functions 
function ObtainAzureParams(FileType) {
    try {
        var urlMain = "/Services/WCFWebService.svc/ObtainAzureParameters";
        var DataUrl = '?FileType=' + FileType
        urlMain = urlMain + DataUrl;
        var ResultData = ReturnDataFromService(urlMain);
        var j = 0;
        return ResultData;
    }
    catch (e) {
        HeaderDataErrorReport(e);
    }
}