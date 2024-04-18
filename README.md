When using playwright to test a browser extension which makes use of indexedDb, there are problems accessing the database objectStores properly within the context of the tests if accessing the page as a `chrome-extension://`. The database is there and accessible but none of the `objectStores` are created or available, and the `onupgradeneeded` event handler is never fired. 


I can call `page.goto` to the extension using the `chrome-extension://` protocol, which works fine. But opening the extensions like that and trying to access the objectStoreNames of the DB yields an empty object store name list. Trying to execute a transaction against an object store that is meant to be there fails saying it's not there. 
Calling runtime.sendMessage works (as in, it doesn't error).

I can also call `page.goto` to the extension using a simple `file://` protocol. In that case, the DB is accessible and the objectStores ARE available. However any call to runtime.sendMessage will error. 

This puts me in a stuck position of being unable to write tests for this kind of extension. Am I doing something wrong here? Is th


I am running playwright with:
`PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1 npx playwright test --ui`

I'm also importing `test` and `expect` from a fixture where I'm using `launchPersistentContext` and loading the extension, as per the reccomendations regarding browser extensions. This behaviour is exhibited with headless true or false.


Because of the nature of this problem providing a simple code example won't do. So I've reated a tiny repo which demonstrates the issue here:  https://github.com/harel/pw-db-bug


once cloned you can execute the tests to demontrate the problem using: 

`PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS=1 npx playwright test --ui`
