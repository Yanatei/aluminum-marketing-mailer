"use strict";
const SHEET_ID = "17Fsn7FGGHGIwrxea0bOLtmBF5-VMn30nIUxxPu78YvM";
readSheet();
function hello() {
    Logger.log("Hello Apps Script");
}
function readSheet() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheets()[0];
        const data = sheet.getDataRange().getValues();
        Logger.log(data);
    }
    catch (error) {
        Logger.log(`读取表格失败: ${error}`);
    }
}
