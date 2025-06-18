import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FabricjsEditorComponent } from "projects/angular-editor-fabric-js/src/public-api";
import { fabric } from "fabric";
import { HttpClient, HttpXhrBackend } from "@angular/common/http";

declare var FontFace: any;

import JSZip from 'jszip';
import { saveAs } from 'file-saver';



@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})


export class AppComponent implements OnInit {
  @ViewChild("canvasEditor", { static: false })
  canvasEditor!: FabricjsEditorComponent;
  @ViewChild('uploadFileInput') uploadFileInput!: ElementRef;
  showTextDropdown = false;
  showImportExportDropdown = false;
  showProductDropdown = false;
  currentTemplates: { front: any, back: any } = { front: null, back: null };
extraField1: any;
extraField2: any;

sampleRecord = {
  FirstName: 'Jessica',
  LastName: 'Neuwirth',
  full_name: 'Jessica Neuwirth',
  PropertyAddress: '177 Main St #c',
  PropertyCity: 'Millbury',
  PropertyState: 'MA',
  PropertyZip: '1527',
  MailingAddress: '28 Church St',
  Mailingcity: 'Grafton',
  Mailingzip: '01519-1518',
  AgentName: 'Auntie Gina',
  AgentNumber: '559-206-1566',
  ReturnAddressStreet: '1099 East Champlain Drive, Suite A #229',
  ReturnAddressCityStateZip: 'Fresno, CA 93720'
};


  toggleTextDropdown() {
    this.showTextDropdown = !this.showTextDropdown;
  }
  toggleImportExportDropdown() {
    this.showImportExportDropdown = !this.showImportExportDropdown;
  }

  toggleProductDropdown() {
    this.showProductDropdown = !this.showProductDropdown;
  }

  openFileUpload() {
    this.uploadFileInput.nativeElement.click();
  }

  ngAfterViewInit() {
    // Canvas is now initialized inside the editor component
  }

  /** Import (Load) Saved Canvas */
  /** Import SVG File and Preserve Bleed Area */
  loadCanvas() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/svg+xml";

    input.addEventListener("change", (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const svgString = e.target?.result as string;
          const fabricCanvas = this.canvas.getCanvas(); // Get Fabric.js instance

          // Step 1: Store Bleed Area Before Clearing Canvas
          const bleedLines = this.getBleedAreaLines(); // Get existing bleed area

          fabricCanvas.clear(); // Clear previous objects before loading new one

          // Load SVG and ensure text is editable
          fabric.loadSVGFromString(svgString, (objects, options) => {
            const editableObjects: fabric.Object[] = [];

            objects.forEach((obj) => {
              // Check if the object is text-based
              if (obj instanceof fabric.Text || obj instanceof fabric.IText) {
                const textObj = new fabric.Textbox(
                  (obj as fabric.Text).text || "",
                  {
                    left: obj.left || 0,
                    top: obj.top || 0,
                    fontFamily: (obj as fabric.Text).fontFamily || "Arial",
                    fontSize: (obj as fabric.Text).fontSize || 20,
                    fill: (obj as fabric.Text).fill || "#000",
                    width: obj.width || 200,
                    selectable: true,
                    evented: true,
                    editable: true,
                    hasControls: true,
                    hasBorders: true,
                  }
                );

                editableObjects.push(textObj);
              } else {
                // Make non-text objects selectable and editable
                obj.set({
                  selectable: true,
                  evented: true,
                  hasControls: true,
                  hasBorders: true,
                  hoverCursor: "move",
                });

                editableObjects.push(obj);
              }
            });

            // Step 2: Add Elements to Canvas
            editableObjects.forEach((obj) => fabricCanvas.add(obj));

            // Step 3: Restore Bleed Area Lines
            bleedLines.forEach((line) => fabricCanvas.add(line));

            fabricCanvas.renderAll();
            alert(
              "SVG Template Imported Successfully! Editable text is now enabled."
            );
          });
        };

        reader.readAsText(file);
      }
    });

    input.click(); // Open file dialog
  }

  fontSizes: number[] = [
    8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64,
  ];
  selectedFontSize: number = 24; // Default font size

  isFront: boolean = true; // Tracks whether the front side is active
  frontCanvas: fabric.Canvas;
  backCanvas: fabric.Canvas;

  frontCanvasData: any | null = null; // Stores JSON data for the front canvas
  backCanvasData: any | null = null; // Stores JSON data for the back canvas

  @ViewChild("canvas", { static: false }) canvas: FabricjsEditorComponent;
  @ViewChild("previewModal") previewModal: ElementRef;
  @ViewChild("modalImage") modalImage: ElementRef;

  toggleSide() {
    const canvasJSON = this.canvas.getCanvas().toJSON();
  
    if (this.isFront) {
      this.selectedSide = 'front';
      this.frontCanvasData = canvasJSON;
      this.canvas.getCanvas().clear();
  
      if (this.backCanvasData) {
        this.canvas.getCanvas().loadFromJSON(this.backCanvasData, () => {
          this.canvas.getCanvas().renderAll();
          this.addDashedSafetyArea();
          this.lockBarcodes();
          this.canvas.bringGuidesToFront();
        });
      }
    } else {
      this.selectedSide = 'back';
      this.backCanvasData = canvasJSON;
      this.canvas.getCanvas().clear();
  
      if (this.frontCanvasData) {
        this.canvas.getCanvas().loadFromJSON(this.frontCanvasData, () => {
          this.canvas.getCanvas().renderAll();
          this.addDashedSafetyArea();
          this.lockBarcodes();
          this.canvas.bringGuidesToFront();
        });
      }
    }
  
    this.isFront = !this.isFront;
    this.addDashedSafetyArea();
  }


public exportToOLConnectHtml(): void {
  const canvas = this.canvas.getCanvas();
  const objects = canvas.getObjects();
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const bgColor = canvas.backgroundColor || 'white'; // Default to white if none

  let htmlContent = `<div class="page" style="
    position:relative;
    width:${width}px;
    height:${height}px;
    background-color:${bgColor};
    overflow:hidden;
  ">\n`;

  for (const obj of objects) {
    if (obj.type === 'textbox' || obj.type === 'text') {
      const text = (obj as fabric.Textbox).text || '';
      htmlContent += `
        <div style="
          position:absolute;
          left:${obj.left}px;
          top:${obj.top}px;
          width:${obj.width}px;
          font-family:'${(obj as any).fontFamily}';
          font-size:${(obj as any).fontSize}px;
          font-weight:${(obj as any).fontWeight || 'normal'};
          font-style:${(obj as any).fontStyle || 'normal'};
          color:${(obj as any).fill};
        ">
          ${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
        </div>\n`;
    }

    if (obj.type === 'image') {
      const img = obj as fabric.Image;
      const src = (img.getElement() as HTMLImageElement).src;

      htmlContent += `
        <img src="${src}" style="
          position:absolute;
          left:${img.left}px;
          top:${img.top}px;
          width:${img.width * (img.scaleX || 1)}px;
          height:${img.height * (img.scaleY || 1)}px;
        "/>\n`;
    }
  }

  htmlContent += `</div>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `olconnect-template.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



/* ════════════════════════════════════════════════════════════════
   1) buildPageHtml  – creates one <div class="page">…</div> block
   ════════════════════════════════════════════════════════════════ */
private async buildPageHtml(
  json: any,
  W: number,
  H: number,
  imagesFolder: JSZip,
  images: Array<{ id: string; filename: string }>
): Promise<string> {

  // StaticCanvas typings omit width/height → cast as any then set them
  const temp = new fabric.StaticCanvas(null, {} as any);
  temp.setWidth(W);
  temp.setHeight(H);

  return new Promise<string>(resolve => {
    temp.loadFromJSON(json, () => {
      const bg = (temp.backgroundColor as string) || '#ffffff';
      let html = `<div class="page" style="position:relative;width:${W}px;height:${H}px;
background-color:${bg};overflow:hidden;">`;

      for (const o of temp.getObjects()) {

        /* TEXT **************************************************************/
        if (o.type === 'textbox' || o.type === 'text' || o.type === 'i-text') {
          const t = o as fabric.Textbox;
          const fill = typeof (t as any).fill === 'string' ? (t as any).fill : '#000';
          html += `\n<div style="position:absolute;left:${o.left}px;top:${o.top}px;width:${o.width}px;
font-family:'${(t as any).fontFamily || 'Arial'}';font-size:${(t as any).fontSize || 12}px;
font-weight:${(t as any).fontWeight || 'normal'};font-style:${(t as any).fontStyle || 'normal'};
color:${fill};text-align:${(t as any).textAlign || 'left'};">${
              this.convertPlainTextToVariables(t.text || '')
                .replace(/</g,'&lt;').replace(/>/g,'&gt;')
            }</div>`;
        }

        /* IMAGE *************************************************************/
        if (o.type === 'image') {
          const img = o as fabric.Image;
          const src = (img.getElement() as HTMLImageElement).src;
          const ext = (src.split(';')[0].split('/')[1] || 'png').toLowerCase();
          const filename = `img-${images.length}.${ext}`;
          const id       = `res-${this.generateUUID()}`;

          // inline/base64 images → write to zip
          if (src.startsWith('data:')) {
            imagesFolder.file(filename, src.split(',')[1], { base64: true });
          }
          images.push({ id, filename });

          html += `\n<img src="images/${filename}" style="position:absolute;left:${img.left}px;top:${img.top}px;
width:${img.width * (img.scaleX || 1)}px;height:${img.height * (img.scaleY || 1)}px;"/>`;
        }
      }

      html += '</div>'; // close .page
      resolve(html);
    });
  });
}


/* ════════════════════════════════════════════════════════════════
   2) exportAsOLTemplate – writes ONE HTML file with both pages
   ════════════════════════════════════════════════════════════════ */
public async exportAsOLTemplate(record: { [k: string]: string }): Promise<void> {
  const zip         = new JSZip();
  const docFolder   = zip.folder('public')!.folder('document')!;
  const cssFolder   = docFolder.folder('css')!;
  const imgFolder   = docFolder.folder('images')!;
  const fontsFolder = docFolder.folder('fonts')!;

  /* canvas size is identical for both sides */
  const W = this.canvas.getCanvas().getWidth();
  const H = this.canvas.getCanvas().getHeight();

  /* JSON snapshots for each side (blank back/front if never edited) */
  const jsonFront = this.frontCanvasData ?? this.canvas.getCanvas().toJSON();
  const jsonBack  = this.backCanvasData  ?? { version:'fabric', objects:[], background:'#ffffff' };

  /* build page HTML fragments and gather image resources */
  const images: Array<{ id:string; filename:string }> = [];
  const pageHtmlFront = await this.buildPageHtml(jsonFront, W, H, imgFolder, images);
  const pageHtmlBack  = await this.buildPageHtml(jsonBack , W, H, imgFolder, images);

  /* single combined HTML file */
  const sectionFile = 'section-combined.html';
  const fullHtml =
`<!DOCTYPE html><html section="Section 1" dpi="96" scale="1.0">
<head>
<link rel="stylesheet" href="css/default.css"/>
<link rel="stylesheet" href="css/context_all_styles.css"/>
<link rel="stylesheet" href="css/context_web_styles.css"/>
</head><body spellcheck="false" contenteditable="false">
${pageHtmlFront}
${pageHtmlBack}
</body></html>`;
  docFolder.file(sectionFile, fullHtml);

  /* resources (fonts + CSS) */
  await this.embedFontsInto(fontsFolder);
  this.embedCssInto(cssFolder);

  /* build manifest (ONE section) */
  const sectionId = `res-${this.generateUUID()}`;
  zip.file('index.xml', this.buildIndexXml(sectionId, sectionFile, images));

  /* zip → blob → download */
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, 'template.OL-template');
}


/* ════════════════════════════════════════════════════════════════
   3) embedFontsInto – unchanged from earlier two-page version
   ════════════════════════════════════════════════════════════════ */
private async embedFontsInto(folder: JSZip) {
  folder.file('Lindy-Bold.woff',         await this.loadAssetAsBase64('assets/fonts/Lindy-Bold.woff'),         { base64:true });
  folder.file('PremiumUltra26.woff',     await this.loadAssetAsBase64('assets/fonts/PremiumUltra26.woff'),     { base64:true });
  folder.file('Ctorres.woff',            await this.loadAssetAsBase64('assets/fonts/Ctorres.woff'),            { base64:true });
  folder.file('ArialRoundedMTBold.woff', await this.loadAssetAsBase64('assets/fonts/ArialRoundedMTBold.woff'), { base64:true });
}


/* ════════════════════════════════════════════════════════════════
   4) embedCssInto – unchanged helper for three tiny CSS files
   ════════════════════════════════════════════════════════════════ */
private embedCssInto(folder: JSZip) {
  folder.file('default.css', `
@font-face{font-family:'Lindy-Bold';src:url('../fonts/Lindy-Bold.woff') format('woff');}
@font-face{font-family:'PremiumUltra';src:url('../fonts/PremiumUltra26.woff') format('woff');}
@font-face{font-family:'Ctorres';src:url('../fonts/Ctorres.woff') format('woff');}
@font-face{font-family:'ArialRoundedMTBold';src:url('../fonts/ArialRoundedMTBold.woff') format('woff');}
body{margin:0;padding:0;}`.trim());

  folder.file('context_all_styles.css', '/* Context all styles */');
  folder.file('context_web_styles.css', '/* Context web styles */');
}


/* ════════════════════════════════════════════════════════════════
   5) buildIndexXml – single-section manifest
   ════════════════════════════════════════════════════════════════ */
private buildIndexXml(
  sectionId: string,
  sectionFile: string,
  imgs: Array<{ id: string; filename: string }>
): string {

  const uid = () => `res-${this.generateUUID()}`;
  const style = { def:uid(), all:uid(), web:uid() };
  const space = { CMYK:uid(), RGB:uid() };
  const col   = { Black:uid(), Cyan:uid(), Magenta:uid(), Yellow:uid(),
                  WebRed:uid(), WebGreen:uid(), WebBlue:uid(), White:uid() };

  const imgXml = imgs.map(i => `
        <image id="${i.id}">
          <location>public/document/images/${i.filename}</location>
        </image>`).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<package schemaVersion="1.0.0.61" htmlVersion="1.0.0.3"
         xmlns="http://www.objectiflune.com/connectschemas/Template"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata/>
  <manifest>
    <colorProfiles/>
    <colorSpaces>
      <colorSpace id="${space.CMYK}"><colorSpaceType>2</colorSpaceType><name>CMYK</name></colorSpace>
      <colorSpace id="${space.RGB}"><colorSpaceType>1</colorSpaceType><name>RGB</name></colorSpace>
    </colorSpaces>
    <colorTints/>
    <colors>
      <color id="${col.Black}"><name>Black</name><colorSpace>${space.CMYK}</colorSpace>
        <values>0</values><values>0</values><values>0</values><values>1</values></color>
      <color id="${col.Cyan}"><name>Cyan</name><colorSpace>${space.CMYK}</colorSpace>
        <values>1</values><values>0</values><values>0</values><values>0</values></color>
      <color id="${col.Magenta}"><name>Magenta</name><colorSpace>${space.CMYK}</colorSpace>
        <values>0</values><values>1</values><values>0</values><values>0</values></color>
      <color id="${col.Yellow}"><name>Yellow</name><colorSpace>${space.CMYK}</colorSpace>
        <values>0</values><values>0</values><values>1</values><values>0</values></color>
      <color id="${col.WebRed}"><name>WebRed</name><colorSpace>${space.RGB}</colorSpace>
        <values>1</values><values>0</values><values>0</values></color>
      <color id="${col.WebGreen}"><name>WebGreen</name><colorSpace>${space.RGB}</colorSpace>
        <values>0</values><values>1</values><values>0</values></color>
      <color id="${col.WebBlue}"><name>WebBlue</name><colorSpace>${space.RGB}</colorSpace>
        <values>0</values><values>0</values><values>1</values></color>
      <color id="${col.White}"><name>White</name><colorSpace>${space.RGB}</colorSpace>
        <values>1</values><values>1</values><values>1</values></color>
    </colors>
    <contexts>
      <context id="${sectionId}-ctx">
        <type>WEB</type>
        <section>${sectionId}</section>
        <includedResources>${style.def}</includedResources>
        <includedResources>${style.all}</includedResources>
        <includedResources>${style.web}</includedResources>
        <defSection>${sectionId}</defSection>
      </context>
    </contexts>
    <fontDefinitions/><fonts/>
    <images>${imgXml}
    </images>
    <javascripts/><masters/><media/><scssResources/>
    <sections>
      <section id="${sectionId}">
        <location>public/document/${sectionFile}</location>
        <context>${sectionId}-ctx</context>
        <name>Section 1</name>
        <size><name>Custom</name><width>100%</width><height>100%</height></size>
        <portrait>true</portrait>
        <left-margin>0cm</left-margin><top-margin>0cm</top-margin>
        <right-margin>0cm</right-margin><bottom-margin>0cm</bottom-margin>
        <left-bleed>3mm</left-bleed><top-bleed>3mm</top-bleed>
        <right-bleed>3mm</right-bleed><bottom-bleed>3mm</bottom-bleed>
        <zoomLevel>100%</zoomLevel>
      </section>
    </sections>
    <stylesheets>
      <stylesheet id="${style.def}"><location>public/document/css/default.css</location><readOnly>false</readOnly></stylesheet>
      <stylesheet id="${style.all}"><location>public/document/css/context_all_styles.css</location><readOnly>false</readOnly></stylesheet>
      <stylesheet id="${style.web}" target-context="WEB"><location>public/document/css/context_web_styles.css</location><readOnly>false</readOnly></stylesheet>
    </stylesheets>
    <translationResources/>
  </manifest>
  <datamodelconfigadapter>
    <dataTypes/>
    <datamodel version="1">
${this.generateDataModelFields()}
    </datamodel>
  </datamodelconfigadapter>
  <locale><source>SYSTEM</source></locale>
  <colorSettings>
    <colorManagement>false</colorManagement>
    <renderingIntent>RELATIVE_COLORIMETRIC</renderingIntent>
  </colorSettings>
  <scripts/><translationFileEntries/><defaultParameters/>
</package>`;
}

private convertPlainTextToVariables(text: string): string {
  const normalized = text.trim().replace(/\s+/g, ' ');

  // =========================
  // PROPERTY BLOCKS
  // =========================

  // Template 1
  if (/4903 Morena Blud Ste 1211 San Diego, CA 92102/i.test(normalized)) {
    return '@PropertyAddress@, @PropertyState@ @PropertyZip@';
  }

  // Template 2
  if (/45 Broadway Chula Vista, CA 91910/i.test(normalized)) {
    return '@PropertyAddress@, @PropertyState@ @PropertyZip@';
  }

  // Template 3 (new variant of Broadway)
  if (/45 Broadway.*Chula Vista, CA 91910/i.test(normalized)) {
    return '@PropertyAddress@, @PropertyState@ @PropertyZip@';
  }

  // Template 4
  if (/4903 Morena Blud San Diego, CA 92117/i.test(normalized)) {
    return '@PropertyAddress@, @PropertyState@ @PropertyZip@';
  }

  // =========================
  // MAILING BLOCKS
  // =========================

  // Template 1 bottom
  if (/William Rhodes 2918 Jamestown Dr Montgomery, AL 36111-1211/i.test(normalized)) {
    return '@FirstName@ @LastName@ @MailingAddress@, @MailingState@ @Mailingzip@';
  }

  // Template 2 bottom
  if (/Krask Scott R 405 Hunt River Way Suwanee, GA 30024-2745/i.test(normalized)) {
    return '@FirstName@ @LastName@ @MailingAddress@, @MailingState@ @Mailingzip@';
  }

  // Template 3 bottom
  if (/Smith Kermit R 2122 Riding Crop Way Windsor Mill, MD 21244/i.test(normalized)) {
    return '@FirstName@ @LastName@ @MailingAddress@, @MailingState@ @Mailingzip@';
  }

  // Template 4 bottom
  if (/Goberdan Lisa 127 Hempstead Ave Lynbrook, NY 1156-1612/i.test(normalized)) {
    return '@FirstName@ @LastName@ @MailingAddress@, @MailingState@ @Mailingzip@';
  }

  // Template 5 bottom
  if (/Lisa Goberdan 127 Hempstead Ave Lynbrook, NY 11563-1612/i.test(normalized)) {
    return '@FirstName@ @LastName@ @MailingAddress@, @MailingState@ @Mailingzip@';
  }

  // Template 6 bottom
  if (/Edward J\.Dyll 14817 Le Grande Dr Addison, TX 75001 - 4912/i.test(normalized)) {
    return '@FirstName@ @LastName@ @MailingAddress@, @MailingState@ @Mailingzip@';
  }

  // Template 7 bottom
  if (/Esther Bernice Dunn 523 n Mulberry St Mansfield, OH 44902-1042/i.test(normalized)) {
    return '@FirstName@ @LastName@ @MailingAddress@, @MailingState@ @Mailingzip@';
  }

  // =========================
  // DEFAULT: return original
  // =========================
  return text;
}





private extractVariableFieldsFromCanvas(canvas: fabric.Canvas): Set<string> {
  const fields = new Set<string>();
  for (const obj of canvas.getObjects()) {
    if (obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text') {
      const text = (obj as fabric.Textbox).text || '';
      const matches = text.match(/\[([^\]]+)\]/g);
      if (matches) {
        matches.forEach(match => {
          const fieldName = match.replace(/\[|\]/g, '');
          fields.add(fieldName);
        });
      }
    }
  }
  return fields;
}

private generateDataModelFields(): string {
  const discFields = [
    'FirstName', 'LastName', 'full_name', 'PropertyAddress', 'PropertyCity', 'PropertyState', 'PropertyZip',
    'MailingAddress', 'address2', 'Mailingcity', 'MailingState', 'Mailingzip',
    'AgentName', 'AgentNumber', 'ReturnAddressStreet', 'ReturnAddressCityStateZip',
    'extra_field_1', 'extra_field_2', 'extra_field_3',
    'sequence', 'cont_id', 'imbarcode', 'Website', 'list', 'batch', 'ylhq_id',
    'order_id', 'short_code', 'user_id', 'MailingDate', 'Pictures', 'imbDigits'
  ];

  let xml = '<configs>\n';
  discFields.forEach(field => {
    xml += `        <field type="string" name="${field}" required="true"/>\n`;
  });
  xml += '    </configs>';
  return xml;
}


private generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}



private async loadAssetAsBase64(path: string): Promise<string> {
  const response = await fetch(path);
  const blob = await response.blob();
const buffer = await (blob as any).arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}


  private isBarcode(obj: fabric.Object): boolean {
    if (obj.type !== 'image') return false;
    const srcStr: string = (obj as any).getSrc?.() || (obj as any).src || '';
    // Identify the barcode image by its filename or characteristics
    if (srcStr.toLowerCase().includes('barcode')) {
      return true;
    }
  
    // Optionally: check dimensions or aspect ratio if filename is not enough
    const bounds = obj.getBoundingRect();
    const aspectRatio = bounds.width / bounds.height;
    return (aspectRatio > 4 || aspectRatio < 0.25);  // very wide or tall = likely barcode
  }
  
  
  lockBarcodes() {
    this.canvas.getCanvas().getObjects().forEach((obj: any) => {
      const isBarcode = obj.type === 'image' && (
        (obj.src && obj.src.includes("barcode")) ||
        (obj.src && obj.src.includes("download.png")) ||
        (obj.width > 100 && obj.width < 1100 && obj.height < 400 && obj.height > 80)
      );
  
      if (isBarcode) {
        obj.set({
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          selectable: false,
          evented: false,
          hoverCursor: 'default',
        });
        (obj as any).isBarcode = true;
      }

      if (obj.type === 'textbox' && typeof obj.text === 'string') {
        const text = obj.text.trim();
        const lines = text.split('\n');
      
        const zipRegex = /\b\d{5}(?:\s?-\s?\d{4})?\b/;
        const cityStateZipRegex = /,\s?[A-Z]{2}\s+\d{4,5}(?:\s?-\s?\d{4})?$/;
      
        const hasAtLeastTwoLines = lines.length >= 2;
        const endsWithCityStateZip = cityStateZipRegex.test(lines[lines.length - 1]);
      
        if (hasAtLeastTwoLines && endsWithCityStateZip) {
          obj.set({
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            evented: false,
            hoverCursor: 'default',
          });
          (obj as any).isProtectedAddress = true;
        }
      }
      
  
      // 🔐 Lock protected postage text
      if (obj.type === 'textbox' && typeof obj.text === 'string') {
        const normalized = obj.text.replace(/\s+/g, '').toLowerCase();
        if (
          normalized.includes('firstclass') &&
          normalized.includes('presort') &&
          normalized.includes('postagepaid') &&
          normalized.includes('ylhq')
        ) {
          obj.set({
            lockMovementX: true,
            lockMovementY: true,
            lockScalingX: true,
            lockScalingY: true,
            lockRotation: true,
            selectable: false,
            evented: false,
            hoverCursor: 'default',
          });
          (obj as any).isProtectedText = true;
        }
      }
    });
  }
  
  
  

  saveDesigns() {
    const canvasJSON = this.canvas.getCanvas().toJSON();

    if (this.isFront) {
      this.frontCanvasData = canvasJSON;
    } else {
      this.backCanvasData = canvasJSON;
    }

    console.log("Front Design:", this.frontCanvasData);
    console.log("Back Design:", this.backCanvasData);
  }

  // Add Text Method
  addText() {
    if (!this.canvas.textString) return;

    const text = new fabric.Textbox(this.canvas.textString, {
      left: 100,
      top: 100,
      fontFamily: this.selectedFont,
      fontWeight: this.selectedFontWeight,
      fontStyle: this.isItalic ? "italic" : "normal",
      fontSize: this.selectedFontSize, // Use selected font size
      fill: "#000",
    });

    this.canvas.getCanvas().add(text);
    this.canvas.textString = ""; // Clear the input field
  }

  title = "angular-editor-fabric-js";

  activeTab: string = "text";

  // Starting index
extraFieldCounter = 1;
addButtonText = 'Add Extra Field 1';

addNextExtraField() {
  const variableName = `extra_field${this.extraFieldCounter}`;
  const displayText = `{{${variableName}}`;

  const newText = new fabric.Textbox(displayText, {
    left: 100,
    top: 100 + (this.extraFieldCounter - 1) * 50, // har naye field ko neeche shift karne ke liye
    fontFamily: this.selectedFont,
    fontWeight: this.selectedFontWeight,
    fontStyle: this.isItalic ? "italic" : "normal",
    fontSize: this.selectedFontSize,
    fill: "#000",
    editable: false,
  });

  this.canvas.getCanvas().add(newText);

  // Counter aur button text update karo
  this.extraFieldCounter++;
  this.addButtonText = `Add Extra Field ${this.extraFieldCounter}`;
}

  

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Default font properties
  selectedFont: string = "ArialRoundedMTBold";
  selectedFontWeight: string = "400";
  isBold: boolean = false;
  isItalic: boolean = false;

  // @ViewChild('canvas', { static: false }) canvas: FabricjsEditorComponent;

  // Pre-built templates
  prebuiltTemplates = [
    {
      name: "Blessed Postcard 4.25",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/blessed.png",
      filePathFront:
        "../assets/prebuilt-templates/Blessed Postcard (Front).json",
    },
    {
      name: "Blessed Postcard 4.25",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/blessed-back.png",
      filePathFront:
        "../assets/prebuilt-templates/Blessed Postcard (Back).json",
    },
    {
      name: "Doodle Street View",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/doodle_street_view.png",
      filePathFront:
        "../assets/prebuilt-templates/Doodle Streetview Postcard (Front).json",
    },
    {
      name: "Doodle Street View",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/doodle_street_view_back.png",
      filePathFront:
        "../assets/prebuilt-templates/Doodle Streetview Postcard (Back).json",
    },
    {
      name: "Flower Postcard",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/flower_postcard_front.png",
      filePathFront:
        "../assets/prebuilt-templates/Flower Postcard (Front).json",
    },
    {
      name: "Flower Postcard",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/flower_postcard_back.png",
      filePathFront:
        "../assets/prebuilt-templates/Flower Postcard (Back).json",
    },
    {
      name: "Realistic Postcard",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/rp_back.png",
      filePathFront: "../assets/prebuilt-templates/Realistic Postcard (Back).json",
    },
    {
      name: "Realistic Postcard",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/rp.png",
      filePathFront: "../assets/prebuilt-templates/Realistic Postcard (Front).json",
    },
    // {
    //   name: "Street View Postcard (Back)",
    //   size: "4.25x5.5",
    //   side: "back",
    //   image: "../assets/img/svp_back.png",
    //   filePathFront: "../assets/prebuilt-templates/4.25×5.5/svp_back_4.25.json",
    // },
    // {
    //   name: "Street View Postcard (Front)",
    //   size: "4.25x5.5",
    //   side: "front",
    //   image: "../assets/img/svp.png",
    //   filePathFront:
    //     "../assets/prebuilt-templates/4.25×5.5/svp_front_4.25.json",
    // },
    // {
    //   name: "Violet Postcard (Back)",
    //   size: "4.25x5.5",
    //   side: "back",
    //   image: "../assets/img/vp_back.png",
    //   filePathFront: "../assets/prebuilt-templates/4.25×5.5/vp_back_4.25.json",
    // },
    // {
    //   name: "Violet Postcard (Front)",
    //   size: "4.25x5.5",
    //   side: "front",
    //   image: "../assets/img/vp_back.png",
    //   filePathFront: "../assets/prebuilt-templates/4.25×5.5/vp_front_4.25.json",
    //  },
    // {
    //   name: "Yellow Letter Postcard (Back)",
    //   size: "4.25x5.5",
    //   side: "back",
    //   image: "../assets/img/ylp_back.png",
    //   filePathFront: "../assets/prebuilt-templates/4.25×5.5/ylp_back_4.25.json",
    // },
    // {
    //   name: "Yellow Letter Postcard (Front)",
    //   size: "4.25x5.5",
    //   side: "front",
    //   image: "../assets/img/ylp.png",
    //   filePathFront:
    //     "../assets/prebuilt-templates/4.25×5.5/ylp_front_4.25.json",
    // },

    {
      name: "Casita Postcard",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/casita_postcard_front.png",
      filePathFront:
        "../assets/prebuilt-templates/8.5×5.5/casita_postcard_front.json",
      filePathBack: "../assets/prebuilt-templates/Casita Postcard (Front).json"
    },
    {
      name: "Casita Postcard",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/casita_postcard_back.png",
      filePathFront:
        "../assets/prebuilt-templates/Casita Postcard (Back).json",
    },
    // {
    //   name: "Doodle Street View (Front)",
    //   size: "8.5x5.5",
    //   side: "front",
    //   image: "../assets/img/doodle_street_view.png",
    //   filePathFront:
    //     "../assets/prebuilt-templates/8.5×5.5/doole_street_view_front_8.5.json",
    // },
    // {
    //   name: "Doodle Street View (Back)",
    //   size: "8.5x5.5",
    //   side: "back",
    //   image: "../assets/img/doodle_street_view_back.png",
    //   filePathFront:
    //     "../assets/prebuilt-templates/8.5×5.5/doole_street_view_back_8.5.json",
    // },
    // {
    //   name: "Flower Postcard (Front)",
    //   size: "8.5x5.5",
    //   side: "front",
    //   image: "../assets/img/flower_postcard_front.png",
    //   filePathFront:
    //     "../assets/prebuilt-templates/8.5×5.5/flower_postcard_front_8.5.json",
    // },
    // {
    //   name: "Flower Postcard (Back)",
    //   size: "8.5x5.5",
    //   side: "back",
    //   image: "../assets/img/flower_postcard_back.png",
    //   filePathFront:
    //     "../assets/prebuilt-templates/8.5×5.5/flower_postcard_back_8.5.json",
    // },
    // {
    //   name: "Realistic Postcard (Back)",
    //   size: "8.5x5.5",
    //   side: "back",
    //   image: "../assets/img/rp_back.png",
    //   filePathFront: "../assets/prebuilt-templates/8.5×5.5/rp_back_8.5.json",
    // },
    // {
    //   name: "Realistic Postcard (Front)",
    //   size: "8.5x5.5",
    //   side: "front",
    //   image: "../assets/img/rp.png",
    //   filePathFront: "../assets/prebuilt-templates/8.5×5.5/rp_front_8.5.json",
    // },
    {
      name: "Standard Handwritten Postcard",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/shp_back.png",
      filePathFront: "../assets/prebuilt-templates/Standard Handwritten (Back).json",
    },
    {
      name: "Standard Handwritten Postcard",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/shp.png",
      filePathFront: "../assets/prebuilt-templates/Standard Handwritten (Front).json",
    },
    {
      name: "Street View Postcard",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/svp_back.png",
      filePathFront: "../assets/prebuilt-templates/Street View Postcard (Back).json",
    },
    {
      name: "Street View Postcard",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/svp.png",
      filePathFront: "../assets/prebuilt-templates/Street View Postcard (Front).json",
    },
    {
      name: "Sorry We Missed You Postcard",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/swmy_back.png",
      filePathFront: "../assets/prebuilt-templates/Sorry We Missed You Postcard (Back).json",
    },
    {
      name: "Sorry We Missed You Postcard",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/swmy.png",
      filePathFront: "../assets/prebuilt-templates/Sorry We Missed You Postcard (Front).json",
    },
    {
      name: "Violet Postcard",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/vp_back.png",
      filePathFront: "../assets/prebuilt-templates/Violet Postcard (Back).json",
    },
    {
      name: "Violet Postcard",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/vp.png",
      filePathFront: "../assets/prebuilt-templates/Violet Postcard (Front).json",
    },
    {
      name: "Yellow Letter Postcard",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/ylp_back.png",
      filePathFront: "../assets/prebuilt-templates/Yellow Letter Postcard (Back).json",
    },
    {
      name: "Yellow Letter Postcard",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/ylp.png",
      filePathFront: "../assets/prebuilt-templates/Yellow Letter Postcard (Front).json",
    },
  ];

  // for images in the inside the image tab
  images: string[] = [
    "../assets/img/bird.png",
    "../assets/img/branch.png",
    "../assets/img/candy-stick.png",
    "../assets/img/cat-animal.png",
    "../assets/img/christmas-ball.png",
    "../assets/img/christmas-decorations.png",
    "../assets/img/christmas-stocking.png",
    "../assets/img/christmas-tree.png",
    "../assets/img/christmas.png",
    "../assets/img/envelope.png",
    "../assets/img/hohoho.png",
    "../assets/img/holly.png",
    "../assets/img/letter.png",
    "../assets/img/love.png",
    "../assets/img/merry-christmas.png",
    "../assets/img/mug.png",
    "../assets/img/santa-claus.png",
    "../assets/img/santa-hat.png",
    "../assets/img/snow.png",
    "../assets/img/snowman.png",
    "../assets/img/wreath.png",
    "../assets/img/yes.png",
  ];

  // Selected template from dropdown
  selectedTemplate: any = null;
  fontsLoaded = false;


  selectedSide: 'front'|'back' = 'front'; 

  get filteredTemplates() {
    return this.prebuiltTemplates.filter(template => 
      template.size === this.selectedSize && 
      template.side === this.selectedSide
    );
  }


  async ngOnInit() {

    await this.loadCustomFonts();
    this.fontsLoaded = true;

  const customFont1 = new FontFace(
    "Lindy-Bold",
    "url('assets/fonts/Lindy-Bold.woff') format('woff')"
  );
  
  customFont1.load().then((loadedFont) => {
    (document as any).fonts.add(loadedFont);
    console.log("Custom font 'Lindy-Bold' loaded successfully.");
  }).catch(err => console.error("Failed to load custom font 'Lindy-Bold':", err));

  const customFont2 = new FontFace(
    "PremiumUltra",
    "url('assets/fonts/PremiumUltra26.woff') format('woff')"
  );

  customFont2.load().then((loadedFont) => {
    (document as any).fonts.add(loadedFont);
    console.log("Custom font 'PremiumUltra' loaded successfully.");
  }).catch(err => console.error("Failed to load custom font 'PremiumUltra':", err));

  const customFont3 = new FontFace(
    "Ctorres",
    "url('assets/fonts/Ctorres.woff') format('woff')"
  );

  customFont3.load().then((loadedFont) => {
    (document as any).fonts.add(loadedFont);
    console.log("Custom font 'Ctorres' loaded successfully.");
  }).catch(err => console.error("Failed to load custom font 'Ctorres':", err));

  const customFont4 = new FontFace(
    "ArialRoundedMTBold",
    "url('assets/fonts/ArialRoundedMTBold.woff') format('woff')"
  );

  customFont4.load().then((loadedFont) => {
    (document as any).fonts.add(loadedFont);
    console.log("Custom font 'ArialRoundedMTBold' loaded successfully.");
  }).catch(err => console.error("Failed to load custom font 'ArialRoundedMTBold':", err));


    const fontsToPreload = [
      "Roboto",
      "Open Sans",
      "Poppins",
      "Lato",
      "Montserrat",
      "Nunito",
      "Source Sans Pro",
      "PT Sans",
      "Georgia",
      "Playfair Display",
      "Merriweather",
      "Crimson Text",
      "Libre Baskerville",
      "Cormorant Garamond",
      "Lora",
      "PT Serif",
      "Oswald",
      "Bebas Neue",
      "Abril Fatface",
      "Pacifico",
      "Dancing Script",
      "Chewy",
      "Cookie",
      "Satisfy",
      "Courier New",
      "Lucida Console",
      "Fira Code",
      "Source Code Pro",
      "Inconsolata",
    ];

    fontsToPreload.forEach((font) => {
      if ("fonts" in document) {
        document.fonts
          .load(`16px ${font}`)
          .then(() => console.log(`Font "${font}" loaded.`))
          .catch((err) => console.warn(`Failed to load font "${font}":`, err));
      }
    });

    // Add event listeners for object selection
    this.canvas
      .getCanvas()
      .on("selection:created", (e) => this.onTextObjectSelected(e.target));
    this.canvas
      .getCanvas()
      .on("selection:updated", (e) => this.onTextObjectSelected(e.target));
    this.canvas
      .getCanvas()
      .on("selection:cleared", () => this.clearTextSelection());

    this.frontCanvas = new fabric.Canvas("frontCanvas");
    this.backCanvas = new fabric.Canvas("backCanvas");
    this.backCanvas.dispose(); // Initially dispose of the back canvas
  }

  



  async loadCustomFonts(): Promise<void> {
    const customFonts = [
      new FontFace("Lindy-Bold", "url('assets/fonts/Lindy-Bold.woff') format('woff')"),
      new FontFace("PremiumUltra", "url('assets/fonts/PremiumUltra26.woff') format('woff')"),
      new FontFace("Ctorres", "url('assets/fonts/Ctorres.woff') format('woff')"),
      new FontFace("ArialRoundedMTBold", "url('assets/fonts/ArialRoundedMTBold.woff') format('woff')")
    ];
  
    try {
      const loadedFonts = await Promise.all(customFonts.map(font => font.load()));
      loadedFonts.forEach(loadedFont => (document as any).fonts.add(loadedFont));
      console.log("All custom fonts loaded successfully.");
    } catch (err) {
      console.error("Failed to load custom fonts:", err);
    }
  }

  
  // onFontFamilyChange() {
  //   const activeObject = this.canvas.getCanvas().getActiveObject();

  //   if (activeObject && activeObject.type === "textbox") {
  //     const textbox = activeObject as fabric.Textbox; // Explicitly cast to Textbox
  //     textbox.set("fontFamily", this.selectedFont); // Update the font family
  //     this.canvas.getCanvas().renderAll(); // Re-render the canvas
  //   } else {
  //     console.warn(
  //       "No text object selected or active object is not a textbox."
  //     );
  //   }
  // }

  // onFontFamilyChange() {
  //   const activeObjects = this.canvas.getCanvas().getActiveObjects();

  //   if (!activeObjects || activeObjects.length === 0) {
  //     console.warn("No text objects selected.");
  //     return;
  //   }

  //   activeObjects.forEach((object) => {
  //     if (object instanceof fabric.Textbox || object instanceof fabric.Text) {
  //       object.set("fontFamily", this.selectedFont);
  //     }
  //   });

  //   this.canvas.getCanvas().discardActiveObject(); // Deselect to apply changes
  //   this.canvas.getCanvas().renderAll(); // Re-render canvas
  // }

  onFontFamilyChange() {
    const activeObjects = this.canvas.getCanvas().getActiveObjects();

    if (!activeObjects || activeObjects.length === 0) {
      console.warn("No text objects selected.");
      return;
    }

    activeObjects.forEach((object) => {
      if (object instanceof fabric.Textbox || object instanceof fabric.Text) {
        object.set("fontFamily", this.selectedFont);
      }
    });

    this.canvas.getCanvas().renderAll(); // Re-render canvas
  }

  updateSelectedText() {
    const activeObject = this.canvas.getCanvas().getActiveObject();

    if (activeObject && activeObject.type === "textbox") {
      const textbox = activeObject as fabric.Textbox;

      // Update all font-related properties
      textbox.set("fontFamily", this.selectedFont);
      textbox.set("fontWeight", this.selectedFontWeight);
      textbox.set("fontStyle", this.isItalic ? "italic" : "normal");
      textbox.set("fontSize", this.selectedFontSize);

      // Re-render the canvas to reflect changes
      this.canvas.getCanvas().renderAll();
    } else {
      console.warn(
        "No text object selected or active object is not a textbox."
      );
    }
  }

  // onFontSizeChange() {
  //   const activeObject = this.canvas.getCanvas().getActiveObject();

  //   if (activeObject && activeObject.type === "textbox") {
  //     const textbox = activeObject as fabric.Textbox; // Cast to Textbox
  //     textbox.set("fontSize", this.selectedFontSize); // Update the font size
  //     this.canvas.getCanvas().renderAll(); // Re-render the canvas
  //   } else {
  //     console.warn(
  //       "No text object selected or active object is not a textbox."
  //     );
  //   }
  // }

  // Bind font properties to selected text

  onFontSizeChange() {
    const activeObjects = this.canvas.getCanvas().getActiveObjects();

    if (!activeObjects || activeObjects.length === 0) {
      console.warn("No text objects selected.");
      return;
    }

    activeObjects.forEach((object) => {
      if (object instanceof fabric.Textbox || object instanceof fabric.Text) {
        object.set("fontSize", this.selectedFontSize);
      }
    });

    this.canvas.getCanvas().renderAll(); // Re-render canvas
  }

  onTextObjectSelected(target: any) {
    if (target && target.type === "textbox") {
      this.selectedFont = target.fontFamily || "Arial";
      this.selectedFontWeight = target.fontWeight || "400";
      this.isBold = this.selectedFontWeight === "700";
      this.isItalic = target.fontStyle === "italic";
      this.selectedFontSize = target.fontSize || 24; // Update the font size
    }
  }

  // Clear selection when no text is active
  clearTextSelection() {
    this.selectedFont = "Arial";
    this.selectedFontWeight = "400";
    this.isBold = false;
    this.isItalic = false;
  }

  // toggleBold() {
  //   this.isBold = !this.isBold;
  //   this.selectedFontWeight = this.isBold ? "700" : "400";
  //   this.updateSelectedText();
  // }

  // toggle bold text
  toggleBold() {
    this.isBold = !this.isBold;
    this.selectedFontWeight = this.isBold ? "700" : "400";

    const activeObjects = this.canvas.getCanvas().getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;

    activeObjects.forEach((object) => {
      if (object instanceof fabric.Textbox || object instanceof fabric.Text) {
        object.set("fontWeight", this.selectedFontWeight);
      }
    });

    this.canvas.getCanvas().renderAll();
  }

  // toggle ittalic text
  toggleItalic() {
    this.isItalic = !this.isItalic;

    const activeObjects = this.canvas.getCanvas().getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;

    activeObjects.forEach((object) => {
      if (object instanceof fabric.Textbox || object instanceof fabric.Text) {
        object.set("fontStyle", this.isItalic ? "italic" : "normal");
      }
    });

    this.canvas.getCanvas().renderAll();
  }

  // toggleItalic() {
  //   this.isItalic = !this.isItalic;
  //   this.updateSelectedText();
  // }

  async loadImageTemplate(template: any) {
    let height: number, width: number;
  
    switch (template.size) {
      case '4.25x5.5':
        height = 408;
        width = 528;
        break;
      case '8.5x5.5':
        height = 528;
        width = 1056;
        break;
      default:
        console.error('Unsupported template size:', template.size);
        return;
    }
  
    this.changeSizeWithMeasures(height, width, template.size);
  
    // Find matching front/back templates
    let frontTemplate = template;
    let backTemplate = template;
  
    if (template.side === 'front') {
      backTemplate = this.prebuiltTemplates.find(t =>
        t.size === template.size &&
        t.side === 'back' &&
        t.name.replace(/\s*\(.*\)/g, '') === template.name.replace(/\s*\(.*\)/g, '')
      );
    } else {
      frontTemplate = this.prebuiltTemplates.find(t =>
        t.size === template.size &&
        t.side === 'front' &&
        t.name.replace(/\s*\(.*\)/g, '') === template.name.replace(/\s*\(.*\)/g, '')
      );
    }
  
    if (!frontTemplate || !backTemplate) {
      console.error('Matching front/back template not found.');
      return;
    }
  
    // Load both JSONs
    const handler = new HttpXhrBackend({ build: () => new XMLHttpRequest() });
    const http = new HttpClient(handler);
  
    try {
      const frontJson = await http.get(frontTemplate.filePathFront, { responseType: 'text' }).toPromise();
      const backJson = await http.get(backTemplate.filePathFront, { responseType: 'text' }).toPromise();
  
      this.frontCanvasData = frontJson;
      this.backCanvasData = backJson;
  
      // Load selected side onto canvas
      this.isFront = (template.side === 'front');
      const jsonToLoad = this.isFront ? this.frontCanvasData : this.backCanvasData;
  
      this.canvas.loadJsonToCanvas(jsonToLoad); // Must exist in your fabric-js component
  
      this.selectedSize = template.size;
      this.selectedSide = template.side;
      this.selectedTemplate = template;
      this.showProductData = false;
    } catch (err) {
      console.error('Error loading template JSONs:', err);
    }
  }
  
  

  addDashedSafetyArea() {
    this.canvas.addDashedSafetyArea();
  }

  backgroundScaleX: number = 1; // Default scaleX
  backgroundScaleY: number = 1; // Default scaleY
  backgroundPositionX: number = 0; // Default position X
  backgroundPositionY: number = 0; // Default position Y

  public setCanvasImageFromURL() {
    if (this.canvas.props.canvasImage) {
      fabric.Image.fromURL(this.canvas.props.canvasImage, (img) => {
        img.scaleX = this.backgroundScaleX;
        img.scaleY = this.backgroundScaleY;
        img.left = this.backgroundPositionX;
        img.top = this.backgroundPositionY;

        this.canvas
          .getCanvas()
          .setBackgroundImage(
            img,
            this.canvas.getCanvas().renderAll.bind(this.canvas.getCanvas())
          );
      });
    }
  }

  public uploadBackgroundImage(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          img.scaleX = this.backgroundScaleX;
          img.scaleY = this.backgroundScaleY;
          img.left = this.backgroundPositionX;
          img.top = this.backgroundPositionY;

          this.canvas
            .getCanvas()
            .setBackgroundImage(
              img,
              this.canvas.getCanvas().renderAll.bind(this.canvas.getCanvas())
            );
        });
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  public updateBackgroundTransform() {
    const bgImage = this.canvas.getCanvas().backgroundImage as fabric.Image;

    if (bgImage) {
      // Update scaling
      bgImage.scaleX = this.backgroundScaleX;
      bgImage.scaleY = this.backgroundScaleY;

      // Update position
      bgImage.left = this.backgroundPositionX;
      bgImage.top = this.backgroundPositionY;

      this.canvas.getCanvas().renderAll();
    }
  }

  // Export methods (unchanged)
  public rasterize() {
    this.canvas.rasterize();
    this.showTopBarModal = false;
    // var frontImage: HTMLImageElement;
    // var backImage: HTMLImageElement;
    // if (this.isFront) {
    //   frontImage = this.canvas.rasterize();
    //   this.toggleSide();
    //   backImage = this.canvas.rasterize();
    // } else {
    //   backImage = this.canvas.rasterize();
    //   this.toggleSide();
    //   frontImage = this.canvas.rasterize();
    // }
    // this.toggleSide();
    // this.downLoadImage(frontImage, backImage);
    this.addDashedSafetyArea();
  }

  // private downLoadImage(frontImage: HTMLImageElement, backImage: HTMLImageElement) {
  //   const canvas = document.createElement('canvas');
  //   const context = canvas.getContext('2d');
  //   const padding = 20;
  //   const labelHeight = 30;

  //   const loadImage = (img: HTMLImageElement) => {
  //       return new Promise<HTMLImageElement>((resolve) => {
  //           img.onload = () => resolve(img);
  //       });
  //   };

  //   Promise.all([loadImage(frontImage), loadImage(backImage)]).then(([loadedFrontImage, loadedBackImage]) => {
  //       // Set canvas dimensions
  //       canvas.width = Math.max(loadedFrontImage.width, loadedBackImage.width) + 2 * padding;
  //       canvas.height = loadedFrontImage.height + loadedBackImage.height + 3 * padding + 2 * labelHeight;

  //       // Draw front image with label
  //       context.fillStyle = '#000';
  //       context.fillRect(padding, padding, canvas.width - 2 * padding, labelHeight);
  //       context.fillStyle = '#fff';
  //       context.font = '20px Arial';
  //       context.fillText('Front Canvas', padding + 10, padding + 20);
  //       context.drawImage(loadedFrontImage, padding, padding + labelHeight);

  //       // Draw back image with label
  //       const backImageY = padding + loadedFrontImage.height + padding + labelHeight;
  //       context.fillStyle = '#000';
  //       context.fillRect(padding, backImageY, canvas.width - 2 * padding, labelHeight);
  //       context.fillStyle = '#fff';
  //       context.fillText('Back Canvas', padding + 10, backImageY + 20);
  //       context.drawImage(loadedBackImage, padding, backImageY + labelHeight);

  //       // Create download link
  //       const downloadLink = document.createElement('a');
  //       document.body.appendChild(downloadLink);
  //       downloadLink.href = canvas.toDataURL('image/png');
  //       downloadLink.target = '_self';
  //       downloadLink.download = Date.now() + '.png';
  //       downloadLink.click();
  //       document.body.removeChild(downloadLink);
  //   });

  //   // Trigger image loading
  //   frontImage.src = frontImage.src;
  //   backImage.src = backImage.src;
  // }

  public rasterizeSVG() {
    this.canvas.rasterizeSVG();
    this.addDashedSafetyArea();
    this.showTopBarModal = false;
  }

  public exportToHtml() {
    this.canvas.exportToHtml();
    this.addDashedSafetyArea();
    this.showTopBarModal = false;
  }

  // Update the saveCanvasToJSON method
  public saveCanvasToJSON() {
  const canvas = this.canvas.getCanvas();
  const json = JSON.stringify(canvas.toJSON());
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `canvas-export-${this.isFront ? 'front' : 'back'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  this.addDashedSafetyArea();
  }


  // Update the loadCanvasFromJSON method
  public loadCanvasFromJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';

  input.addEventListener('change', (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const canvas = this.canvas.getCanvas();
        
        // Clear existing canvas while preserving bleed area
        const bleedLines = this.getBleedAreaLines();
        canvas.clear();
        
        canvas.loadFromJSON(json, () => {
          // Re-add bleed area if needed
          bleedLines.forEach(line => canvas.add(line));
          canvas.renderAll();
          this.addDashedSafetyArea();
        });
      } catch (error) {
        console.error('Error loading JSON:', error);
        alert('Invalid JSON file. Please upload a valid canvas export.');
      }
    };
    reader.readAsText(file);
  });

  input.click();
  }

  public confirmClear() {
    this.canvas.confirmClear();
    this.addDashedSafetyArea();
    this.showTopBarModal = false;
  }

  preview() {
    const canvasDataUrl = this.canvas.GetCanvasDataUrl();
    this.modalImage.nativeElement.src = canvasDataUrl;
    this.previewModal.nativeElement.style.display = "block";
  }

  closeModal() {
    this.previewModal.nativeElement.style.display = "none";
  }

  // public changeBleedSize() {
  //   this.canvas.changeBleedSize();
  // }

  showProductData: boolean = false;
  showTopBarModal: boolean = false;
  showOptionsModal: boolean = false;

  toggleShowTopBarModal() {
    this.showTopBarModal = !this.showTopBarModal;
  }
  toggleShowOptionsModal() {
    this.showOptionsModal = !this.showOptionsModal;
  }

  toggleProductData() {
    this.showProductData = false;
  }

  // In your component class:
  public selectedSize: string = '4.25x5.5';

  public changeSizeWithMeasures(
    height: number,
    width: number,
    sizeLabel: string
  ) {
    // 1) Clear canvas
    // this.canvas.getCanvas().clear();
    // this.frontCanvasData = null;
    // this.backCanvasData = null;

    // 2) Change size of the Fabric.js canvas
    this.canvas.changeSizeWithMeasures(height, width);
    this.addDashedSafetyArea();

    // 3) Record which size has been selected
    this.selectedSize = sizeLabel;

    console.log(
      `Canvas size changed to ${width}x${height}, selectedSize = ${sizeLabel}`
    );
    this.showProductData = true;
  }

  // public addText() {
  //   if (!this.canvas.textString) {
  //     console.error('No text entered!');
  //     return; // Exit if no text is entered
  //   }

  //   const selectedFont = this.selectedFont;

  //   // Check if the browser supports the `document.fonts` API
  //   if ('fonts' in document) {
  //     document.fonts
  //       .load(`16px ${selectedFont}`) // Load the selected font
  //       .then(() => {
  //         console.log(`Font "${selectedFont}" loaded successfully.`);
  //         this.addTextToCanvas(selectedFont); // Add the text with the loaded font
  //       })
  //       .catch((err) => {
  //         console.error(`Font "${selectedFont}" failed to load.`, err);
  //         this.addTextToCanvas(selectedFont); // Add text even if the font fails to load
  //       });
  //   } else {
  //     console.warn('Font loading API is not supported. Adding text without preloading the font.');
  //     this.addTextToCanvas(selectedFont); // Add text without loading the font
  //   }
  // }

  // Helper function to add text to the canvas
  private addTextToCanvas(font: string) {
    const text = new fabric.Textbox(this.canvas.textString, {
      left: 100,
      top: 100,
      fontFamily: font,
      fontSize: 24,
      fill: "#000",
    });

    this.canvas.getCanvas().add(text);
    this.canvas.textString = ""; // Clear the input field
  }

  public getImgPolaroid(event) {
    this.canvas.getImgPolaroid(event);
  }

  public addImageOnCanvas(url) {
    this.canvas.addImageOnCanvas(url);
  }

  public readUrl(event) {
    this.canvas.readUrl(event);
  }

  public readBgUrl(event) {
    this.canvas.readBgUrl(event);
  }

  public removeWhite(url) {
    this.canvas.removeWhite(url);
  }

  public addFigure(figure) {
    this.canvas.addFigure(figure);
  }

  public removeSelected() {
    this.canvas.removeSelected();
  }

  public sendToBack() {
    this.canvas.sendToBack();
    this.addDashedSafetyArea();
  }

  public bringToFront() {
    this.canvas.bringToFront();
    this.addDashedSafetyArea();
  }

  // public clone() {
  //   const activeObjects = this.canvas.getCanvas().getActiveObjects();

  //   if (!activeObjects || activeObjects.length === 0) {
  //     console.warn("No objects selected for cloning.");
  //     return;
  //   }

  //   const clonedObjects: fabric.Object[] = [];

  //   activeObjects.forEach((object) => {
  //     object.clone((cloned: fabric.Object) => {
  //       cloned.set({
  //         left: object.left + 20, // Offset cloned object to avoid overlap
  //         top: object.top + 20,
  //         evented: true, // Ensure new objects are interactive
  //       });

  //       clonedObjects.push(cloned);

  //       this.canvas.getCanvas().add(cloned);
  //       this.canvas.getCanvas().renderAll();
  //     });
  //   });

  //   // Deselect previous objects and select new cloned ones
  //   this.canvas.getCanvas().discardActiveObject();
  //   const selection = new fabric.ActiveSelection(clonedObjects, {
  //     canvas: this.canvas.getCanvas(),
  //   });

  //   this.canvas.getCanvas().setActiveObject(selection);
  //   this.canvas.getCanvas().renderAll();
  // }

  // public clone() {
  //   this.canvas.clone();
  //   this.addDashedSafetyArea();
  // }

  public clone() {
    const activeObjects = this.canvas.getCanvas().getActiveObjects();

    if (!activeObjects || activeObjects.length === 0) {
      console.warn("No objects selected for cloning.");
      return;
    }

    const clonedObjects: fabric.Object[] = [];

    activeObjects.forEach((object) => {
      object.clone((cloned: fabric.Object) => {
        cloned.set({
          left: (object.left || 0) + 20, // Offset cloned object to avoid overlap
          top: (object.top || 0) + 20,
          evented: true, // Ensure new objects are interactive
        });

        // Special Handling for Text Objects (Keep Same Font and Properties)
        if (object.type === "textbox") {
          const textObject = object as fabric.Textbox;
          const clonedText = new fabric.Textbox(textObject.text, {
            left: cloned.left,
            top: cloned.top,
            fontFamily: textObject.fontFamily,
            fontSize: textObject.fontSize,
            fontWeight: textObject.fontWeight,
            fontStyle: textObject.fontStyle,
            fill: textObject.fill,
            width: textObject.width,
          });

          clonedObjects.push(clonedText);
          this.canvas.getCanvas().add(clonedText);
        } else {
          clonedObjects.push(cloned);
          this.canvas.getCanvas().add(cloned);
        }

        this.canvas.getCanvas().renderAll();
      });
    });

    // Deselect previous objects and select new cloned ones
    this.canvas.getCanvas().discardActiveObject();
    const selection = new fabric.ActiveSelection(clonedObjects, {
      canvas: this.canvas.getCanvas(),
    });

    this.canvas.getCanvas().setActiveObject(selection);
    this.canvas.getCanvas().renderAll();
  }

  public cleanSelect() {
    this.canvas.cleanSelect();
  }

  public setCanvasFill() {
    this.canvas.setCanvasFill();
  }

  public setCanvasImage() {
    this.canvas.setCanvasImage();
  }

  public setId() {
    this.canvas.setId();
  }

  public setOpacity() {
    this.canvas.setOpacity();
  }

  public setFill() {
    this.canvas.setFill();
  }

  public setFontFamily() {
    this.canvas.setFontFamily();
  }

  public setTextAlign(value) {
    this.canvas.setTextAlign(value);
  }

  public setBold() {
    this.canvas.setBold();
  }

  public setFontStyle() {
    this.canvas.setFontStyle();
  }

  public hasTextDecoration(value) {
    this.canvas.hasTextDecoration(value);
  }

  public setTextDecoration(value) {
    this.canvas.setTextDecoration(value);
  }

  public setFontSize() {
    this.canvas.setFontSize();
  }

  public setLineHeight() {
    this.canvas.setLineHeight();
  }

  public setCharSpacing() {
    this.canvas.setCharSpacing();
  }

  public rasterizeJSON() {
    this.canvas.rasterizeJSON();
  }

  public changeFigureColor(color) {
    this.canvas.changeFigureColor(color);
  }

  // onObjectColorChange(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   const selectedColor = inputElement.value; // Get selected color

  //   const activeObject = this.canvas.getCanvas().getActiveObject();

  //   if (activeObject && activeObject.type === "textbox") {
  //     activeObject.set("fill", selectedColor); // Apply color directly
  //     this.canvas.getCanvas().renderAll(); // Re-render the canvas
  //   } else {
  //     console.warn("No text object selected or active object is not a textbox.");
  //   }
  // }

  onObjectColorChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedColor = inputElement.value; // Get selected color
  
    const activeObjects = this.canvas.getCanvas().getActiveObjects();
    if (!activeObjects || activeObjects.length === 0) return;
  
    activeObjects.forEach((object) => {
      if (
        object instanceof fabric.Textbox || 
        object instanceof fabric.Text || 
        object instanceof fabric.Rect || 
        object instanceof fabric.Circle || 
        object instanceof fabric.Triangle || 
        object instanceof fabric.Polygon
      ) {
        (object as fabric.Object).set("fill", selectedColor);
      } else if (object instanceof fabric.Path) {
        (object as fabric.Object).set("stroke", selectedColor);
      }
    });
  
    this.canvas.getCanvas().requestRenderAll(); // ✅ Use requestRenderAll() for smoother real-time updates
  }
  
  getBleedAreaLines(): fabric.Object[] {
    return this.canvas
      .getCanvas()
      .getObjects()
      .filter((obj: any) => obj._id === "bleed-line");
  }
}
