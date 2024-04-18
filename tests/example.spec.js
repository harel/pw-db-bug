//const { test, expect } = require('@playwright/test');
import { test, expect } from './fixtures';


test('as page create row', async ({ page, dirName }) => {
  await page.goto(`file://${dirName}/test.html`);
  const context = page.context()
  await page.getByTestId('button').click().then(() => {
    console.log("BUTTON CLICKED - Row inserted")
  });
  // Here we can query the db, but service worker related messages will fail
  const handleEval = await page.evaluateHandle(() => {
    const transaction = DB.transaction(['mydata'], 'readonly');
    transaction.objectStore('mydata').getAll().onsuccess = ({ target: { result } }) => {
      result.forEach(row => console.log(row))
    }
  })
})


// This will trigger an error log as the "objectStore is not there"
test('as extension create row', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/test.html`);
  const context = page.context()
  await page.getByTestId('button').click().then(async () => {
    console.log("BUTTON CLICKED")
  });

})

test('as extension', async ({ page, extensionId }) => {
  console.log("Extension ID: ", extensionId)
  await page.goto(`chrome-extension://${extensionId}/test.html`);
  const context = page.context()

  const handleEval = await page.evaluateHandle(() => {
    chrome.runtime.sendMessage({ action: 'getRecords' }).then(
      res => console.log("sendMesage -> ", res)
    )
    return DB.objectStoreNames[0];
  })
  console.log("objectStoreNames = ", await handleEval.jsonValue())


});

test('as page', async ({ page, dirName }) => {
  await page.goto(`file://${dirName}/test.html`);
  const context = page.context()

  const handleEval = await page.evaluateHandle(() => {
    // sendMessage would error here but we can get objectStoreNames
    return DB.objectStoreNames[0];
  })
  console.log("objectStoreNames = ", await handleEval.jsonValue())


});