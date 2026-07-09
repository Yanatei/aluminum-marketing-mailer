"use strict";
const SHEET_ID = "1v6Gj5wP8Y7hcUPIDq2896uGSofYqF-7p4UwmlGMpt34";
const SHEET_INDEX = 1;
const EMAIL_SUBJECT = "Factory Supply: Aluminum Foil Food Containers & Rolls";
const TEST_FLAG = false; // Set to true for testing, false for production
const EMAIL_FROM = "sales@dinghaofoil.com";
const EMAIL_NAME = "Dinghao Foil";
let Context = {
    remainingQuota: 0,
    ss: null,
    sheet: null,
    successCount: 0,
    failedCount: 0,
};
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
        Context.ss = ss;
        Logger.log("table initialized successfully");
        let isValid = checkSheets(ss);
        if (!isValid) {
            throw new Error("Table format is incorrect");
        }
        //MailApp getRemainingDailyQuota()
        let remainingQuota = MailApp.getRemainingDailyQuota();
        Context.remainingQuota = remainingQuota;
        Logger.log(`Remaining daily email quota: ${remainingQuota}`);
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
        Context.sheet = sheet;
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
    const statusColumn = 3;
    const sentAtColumn = 4;
    try {
        const sheet = ss.getSheets()[SHEET_INDEX];
        const data = sheet.getDataRange().getValues();
        for (let i = 1; i < data.length && i < Context.remainingQuota; i++) {
            const status = String(data[i][statusColumn] ?? "").trim();
            if (status !== "") {
                continue;
            }
            const email = String(data[i][emailColumnIndex] ?? "").trim();
            if (isValidEmail(email)) {
                // Send email logic here
                const result = sendEmail(email);
                if (result.success) {
                    Context.successCount++;
                    sheet.getRange(i + 1, statusColumn + 1).setValue(EmailStatus.Send);
                    sheet.getRange(i + 1, sentAtColumn + 1).setValue(new Date());
                    Logger.log(`Email sent successfully to ${email}`);
                }
                else {
                    Context.failedCount++;
                    sheet.getRange(i + 1, statusColumn + 1).setValue(EmailStatus.Failed);
                    Logger.log(`Failed to send email to ${email}: ${result.error}`);
                }
            }
            else {
                Logger.log(`Invalid email at row ${i + 1}: ${email}`);
            }
        }
        Logger.log(`Task completed. Processed ${Math.min(data.length - 1, Context.remainingQuota)} rows.`);
        Logger.log(`Summary - Success: ${Context.successCount}, Failed: ${Context.failedCount}`);
    }
    catch (error) {
        Logger.log(`Error in doTask: ${error}`);
    }
}
function sendEmail(email) {
    let result;
    try {
        const htmlBody = HtmlService.createHtmlOutputFromFile("templates/FirstContact").getContent();
        const textBody = HtmlService.createHtmlOutputFromFile("templates/FirstContact-text").getContent();
        const subject = EMAIL_SUBJECT;
        if (TEST_FLAG) {
            Logger.log(`Test Email Sending: Email: ${email}, Subject: ${subject}, 
        Text Body: ${textBody}, HTML Body: ${htmlBody}, From: ${EMAIL_FROM}, Name: ${EMAIL_NAME}`);
        }
        else {
            GmailApp.sendEmail(email, subject, textBody, { htmlBody, from: EMAIL_FROM, name: EMAIL_NAME });
        }
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
