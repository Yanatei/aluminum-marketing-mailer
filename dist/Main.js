"use strict";
const SHEET_ID = "17Fsn7FGGHGIwrxea0bOLtmBF5-VMn30nIUxxPu78YvM";
const SHEET_INDEX = 0;
function main() {
    try {
        const ss = init();
        doTask(ss);
    }
    catch (error) {
        Logger.log(`Initialization failed: ${error}`);
        return;
    }
}
function hello() {
    Logger.log("Hello Apps Script");
}
function init() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        Logger.log("table initialized successfully");
        let isValid = checkSheets(ss);
        if (!isValid) {
            throw new Error("Table format is incorrect");
        }
        return ss;
    }
    catch (error) {
        Logger.log(`table initialization failed: ${error}`);
        throw error;
    }
}
function checkSheets(ss) {
    let isValid = false;
    try {
        const sheet = ss.getSheets()[SHEET_INDEX];
        const rowData = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        isValid = true;
    }
    catch (error) {
        Logger.log(`table format is incorrect: ${error}`);
        isValid = false;
    }
    Logger.log("Checking sheet data successfully");
    return isValid;
}
/**
 * read column: c, and send email
 * @param ss
 */
function doTask(ss) {
    const emailColumnIndex = 2;
    const statusColumn = 4;
    const sentAtColumn = 5;
    try {
        const sheet = ss.getSheets()[SHEET_INDEX];
        const data = sheet.getDataRange().getValues();
        for (let i = 0; i < data.length; i++) {
            const email = String(data[i][emailColumnIndex] ?? "").trim();
            if (isValidEmail(email)) {
                // Send email logic here
                const result = sendEmail(email);
                if (result.success) {
                    sheet.getRange(i + 1, statusColumn).setValue("Sent");
                    sheet.getRange(i + 1, sentAtColumn).setValue(new Date());
                    Logger.log(`Email sent successfully to ${email}`);
                }
                else {
                    sheet.getRange(i + 1, statusColumn).setValue("Failed");
                    Logger.log(`Failed to send email to ${email}: ${result.error}`);
                }
            }
            else {
                Logger.log(`Invalid email at row ${i + 1}: ${email}`);
            }
        }
    }
    catch (error) {
        Logger.log(`Error in doTask: ${error}`);
    }
}
function sendEmail(email) {
    let result;
    try {
        const subject = "Test Email";
        const body = "This is a test email.";
        MailApp.sendEmail(email, subject, body);
        result = { success: true };
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        Logger.log(`Failed to send email to ${email}: ${errorMessage}`);
        result = { success: false, error: errorMessage };
    }
    return result;
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function readSheet() {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheets()[0];
        const data = sheet.getDataRange().getValues();
        Logger.log(data);
    }
    catch (error) {
        Logger.log(`Failed to read table: ${error}`);
    }
}
