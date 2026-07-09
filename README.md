# Aluminum Marketing Mailer

A small Google Apps Script mailer for sending first-contact sales emails from a Google Sheets contact list.

The project is written in TypeScript, compiled to `dist`, and deployed with `clasp`. It reads email addresses from a configured Google Spreadsheet, sends an HTML email with a plain-text fallback through Gmail, and writes the send result back to the sheet.

## What It Does

- Opens a Google Spreadsheet by ID.
- Uses the second worksheet in the spreadsheet (`SHEET_INDEX = 1`).
- Reads recipient email addresses from column C.
- Skips rows whose status column already contains `Send`.
- Sends the first-contact email from the template files in `src/templates`.
- Marks successful sends as `Send`.
- Marks failed sends as `Failed`.
- Writes the send timestamp after a successful send.
- Respects the remaining daily Gmail sending quota reported by Apps Script.

## Spreadsheet Format

The script uses fixed column positions:

| Column | Purpose |
| --- | --- |
| C | Recipient email address |
| D | Email status |
| E | Sent timestamp |

Status values used by the script:

- `Send` means the row has already been processed successfully.
- `Failed` means the send attempt failed.

The first row is treated as a header row and is not sent.

## Email Template

The email content lives in:

- `src/templates/FirstContact.html`
- `src/templates/FirstContact-text.html`

The current message introduces Dinghao Foil as a manufacturer of aluminum foil containers and kitchen foil rolls, and includes the company website, email address, and WhatsApp contact.

## Main Configuration

The main settings are defined at the top of `src/Main.ts`:

```ts
const SHEET_ID = "1v6Gj5wP8Y7hcUPIDq2896uGSofYqF-7p4UwmlGMpt34";
const SHEET_INDEX = 1;
const EMAIL_SUBJECT = "Factory Supply: Aluminum Foil Food Containers & Rolls";
const TEST_FLAG = false;
const EMAIL_FROM = "sales@dinghaofoil.com";
const EMAIL_NAME = "Dinghao Foil";
```

Set `TEST_FLAG` to `true` to log the email payload without sending real emails.

## Project Structure

```text
.
|-- appsscript.json
|-- package.json
|-- tsconfig.json
|-- .clasp.json
`-- src
    |-- Main.ts
    |-- templates
    |   |-- FirstContact.html
    |   `-- FirstContact-text.html
    `-- type
        `-- type.ts
```

## Setup

Install dependencies:

```bash
npm install
```

Log in to Google Apps Script with clasp:

```bash
npx clasp login
```

Make sure `.clasp.json` points to your Apps Script project and uses `dist` as the root directory.

## Build and Deploy

Build the TypeScript project and copy the Apps Script manifest and HTML templates:

```bash
npm run build
```

Push the compiled project to Apps Script:

```bash
npm run push
```

Available npm scripts:

| Script | Description |
| --- | --- |
| `npm run clean` | Removes the `dist` directory |
| `npm run compile` | Compiles TypeScript from `src` to `dist` |
| `npm run copy-manifest` | Copies `appsscript.json` into `dist` |
| `npm run copy-html` | Copies email templates into `dist/templates` |
| `npm run build` | Runs clean, compile, manifest copy, and template copy |
| `npm run push` | Builds the project and pushes it with clasp |
| `npm run watch` | Runs TypeScript in watch mode |

## Running in Apps Script

After deployment, run the `main` function from the Apps Script editor or attach it to a time-based trigger.

The script will request permissions for:

- Reading the configured Google Spreadsheet.
- Sending email through Gmail.
- Logging execution details.

## Notes

- The script uses `GmailApp.sendEmail`, so it is subject to Google account sending limits.
- The sender address in `EMAIL_FROM` must be available to the Google account running the script.
- Email validation is intentionally simple and only checks for a basic email address format.
- This project is designed for controlled, small-batch outreach from a spreadsheet. Review applicable email, consent, and anti-spam requirements before using it for production campaigns.
