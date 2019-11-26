const getDeals = () => getRequestData('api/test/Deal');
const getDealById = (id) => getRequestData('api/test/Deal/'+id);

const getDealsCustomers = () => getRequestData('api/test/Customer');
const getDealsBrokers = () => getRequestData('api/test/Broker');
