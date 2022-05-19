# Notion to Ebook

<p align="center">
  <a
    href="https://github.com/subhamx/notion-to-ebook/blob/master/LICENSE"
    style="margin-right: 1em;">
    <img alt="Apache-2.0" src="https://img.shields.io/github/license/subhamx/notion-to-ebook?color=blue"/>
  </a>
  <a
    href="https://www.npmjs.com/package/@subhamx/notion-to-ebook"
    style="margin-right: 1em;">
    <img alt="NPM Package Link" src="https://img.shields.io/npm/v/@subhamx/notion-to-ebook?color=brightgreen"/>
  </a>
</p>

Notion to Ebook is a lightweight library written in Typescript to convert any notion document consisting of multiple nested documents or databases into an ebook format like PDFs, with the table of contents, page cover, headers etc.

## Use Cases

1. Say you have a notion database containing many documents, and you wish to export them into a single PDF. Notion doesn't allow non-enterprise uses to include all the subpages into a single PDF recursively (Have a look at image below). But this library lets you generate it without any hassle, and even on a free plan. :)
   ![PDF Export Dialog](https://raw.githubusercontent.com/subhamx/notion-to-ebook/HEAD/_docs/4.png)
2. Say you have an e-reader like Kindle would like to send all the articles you have written on Notion workspace every 24 hours automatically. **Notion to Ebook** can help you in it. You can use it to get the Ebook version, then can send it to your e-reader device. :). You may consider using GitHub actions or any similar service to automate the workflow.

## Features

This application requires Zero Configuration. The current implementation does most things like arranging all the files as chapters and generating the Table of Contents, cover page, footer, etc.

There are two modes to use this application:

1. **Standalone mode:** It allows users to generate a separate PDF for each of the HTML pages. For example, if your notion exports have a total of 12 pages (including all nested docs, tables etc.), then there will be precisely 12 PDFs generated for each one of them. You can find the exported merged file inside **session_files/output/standalone**.

2. **Merge mode:** It allows users to generate a single PDF for the entire export. It concatenates each of the notion pages smartly to generate a single document. Table of contents of the whole document is also included at the beginning to ease browsing across the different sections of the merged PDF. You can find the exported standalone files inside **session_files/output/merged**.

> 💡 **Document Arranging Logic:** In merge mode all documents not linking to any other document at the current level are placed before the documents linking to other ones in alphabetical order.

## Installation

```bash
npm install @subhamx/notion-to-ebook
```

## API

The usage is pretty straightforward.

1. If you want to use in the **standalone mode** and generate separate PDF document for each one Notion Page.

```javascript
import { buildStandaloneDocs } from "@subhamx/notion-to-ebook";

const token_v2 = "YOUR_NOTION_TOKEN_V2";
const pageId = "NOTION_PAGE_ID";

buildStandaloneDocs(token_v2, pageId);
```

2. If you want to use in the **merged mode** and generate a single PDF document for each the complete export.

```javascript
import { buildMergedDoc } from "@subhamx/notion-to-ebook";

const token_v2 = "YOUR_NOTION_TOKEN_V2";
const pageId = "NOTION_PAGE_ID";

buildMergedDoc(token_v2, pageId);
```

> ⚠️ **Caution:** Whenever you call any of the instances of buildStandaloneDocs or buildMergedDoc. It removes all files inside the session_files. So please be cautious before starting the script.

### Details on Notion TOKEN_V2

Please note that **TOKEN_V2** used in the application is different from Notion's official API **Internal Integration Token**.

**Follow these steps to get the token_v2.**

1. Open the browser inspector tools and go to **Application** Tab.
2. Then look for the **cookies** section, and use the value corresponding to the key **token_v2** to authenticate to Notion Server.

## Example

We will export [this](https://bx.notion.site/920be5e64bd04f34b3c4450ad3fcc80e?v=deb2aef3fb4244539b2a25c50e8569f3) Notion document, which is a full-page database and has four documents inside it.

> Please note that Notion doesn't allow us to export all of these documents as PDFs in one go without the enterprise plan.

### Links to the output files generated using this library:

1. Standalone files: [Link](https://github.com/subhamX/notion-to-ebook/tree/master/_docs/sample_output/standalone)
2. Merged file: [Link](https://github.com/subhamX/notion-to-ebook/tree/master/_docs/sample_output/merged)

It's Great, isn't it? 🎉

## Future Changes in API

1. Currently, the only export format this library supports is PDF. We plan to add additional formats like LaTex, mobi, epub etc. very soon.
2. More support to tweak the configuration.

## Contributing

This project welcomes contributions and suggestions. Feel free to report bugs and suggest features. It will help us improve this project. ⚡⚡
