# SFMC Rest Client

## Description

Generic Rest Client for Salesforce Marketing Cloud.

## Installation

npm sfmc-rest-client

## Documentation

### Configure client

in _/.env_ add

```
AUTH_URL=https://<your-sfmc-domain>.auth.marketingcloudapis.com
CLIENT_ID=<your client_id>
CLIENT_SECRET=<your client_secret>
```

### Import the client and intilize new client

```
import Rest from 'sfmc-rest-client';
const restClient = new Rest(); 
```
Alternatively you can also provide the credentials in the function call, instead of the env file:
````
import Rest from 'sfmc-rest-client';
const restClient = new Rest(<your client_id>, <your client_secret>, https://<your-sfmc-domain>.auth.marketingcloudapis.com); 
```

### Call REST API

The client supports regular http methods. You need to provide the endpoint and optionally the payload. The client uses Script.Util.HttpRequest. Arguments for this method are also optional.

#### Interface

```
get: function (endpoint, headers = [], continueOnError = true, retries = 0, emptyContentHandling = 0)
post: function ( endpoint, data, headers = [], continueOnError = true, retries = 0, emptyContentHandling = 0)
put: function (endpoint, data, headers = [], continueOnError = true, retries = 0, emptyContentHandling = 0)
patch: function ( endpoint, data, headers = [], continueOnError = true, retries = 0, emptyContentHandling = 0)
delete: function (endpoint, headers = [], continueOnError = true, retries = 0, emptyContentHandling = 0)
```

### Example Calls

#### Get Assets

```
rest.get("/asset/v1/content/assets/");
```

#### Query Assets

```
rest.post("/asset/v1/content/assets/query", {
    page: {
        page: 1,
        pageSize: 100,
    },
    query: {
        leftOperand: {
        property: "assetType.name",
        simpleOperator: "equal",
        value: "htmlemail",
        },
        logicalOperator: "OR",
        rightOperand: {
        property: "assetType.name",
        simpleOperator: "equal",
        value: "templatebasedemail",
        },
    },
});
```
