(function () {
    let DB;
    const dbRequest = indexedDB.open("MYDB");
    dbRequest.onerror = function (event) {
        console.error(`Could not open local database: ${event.target.errorCode}`)
    }
    dbRequest.onsuccess = function (event) {
        DB = dbRequest.result;
    }

    function getRecords() {
        const transaction = DB.transaction(['mydata'], 'readonly');
        const store = transaction.objectStore('mydata');
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = ({ target: { result } }) => resolve(result);
            request.onerror = ({ target: { error } }) => reject(error);
        })
    }


    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request?.action === 'getRecords') {
                getRecords().then((values) => {
                    sendResponse({ data: values });
                });
            }
            return true;
        }
    );


})()
