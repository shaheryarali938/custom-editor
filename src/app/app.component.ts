import { Component, ViewChild } from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-editor-fabric-js';

  @ViewChild('canvas', { static: false }) canvas: FabricjsEditorComponent;

  public rasterize() {
    this.canvas.rasterize();
  }

  public rasterizeSVG() {
    this.canvas.rasterizeSVG();
  }

  public exportToHtml() {
    const htmlContent = this.getEditorContentAsHtml(); // Get the HTML representation of the editor's content
  
    // Create a Blob object from the HTML content
    const blob = new Blob([htmlContent], { type: 'text/html' });
  
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = Date.now() + '.html';  // Set the name of the HTML file
  
    // Trigger the download by clicking the link programmatically
    link.click();
    link.remove();
  }
  


  public getEditorContentAsHtml(): string {
    const canvas = this.canvas.getCanvas();  // Use the getter to get the Fabric.js canvas instance
    let htmlContent = `
      <html>
        <head>
          <style>
            .canvas-container {
              position: relative;
              width: ${canvas.getWidth()}px;
              height: ${canvas.getHeight()}px;
              user-select: none;
              border: 1px solid #000;
            }
            .canvas-object {
              position: absolute;
            }
          </style>
        </head>
        <body>
          <div class="canvas-container">
    `;
  
    // Iterate over all objects on the canvas and generate HTML for each object
    canvas.getObjects().forEach((obj) => {
      if (obj.type === 'text') {
        const textObj = obj as fabric.Text;
        htmlContent += `
          <div class="canvas-object" style="left: ${textObj.left}px; top: ${textObj.top}px; 
            font-size: ${textObj.fontSize}px; font-family: ${textObj.fontFamily}; color: ${textObj.fill};">
            ${textObj.text}
          </div>
        `;
      }
      else if (obj.type === 'image') {
        const imageObj = obj as fabric.Image;
        htmlContent += `
          <img class="canvas-object" src="${imageObj.getSrc()}" style="left: ${imageObj.left}px; top: ${imageObj.top}px;
            width: ${imageObj.width}px; height: ${imageObj.height}px;" />
        `;
      }
      else if (obj.type === 'rect') {
        const rectObj = obj as fabric.Rect;
        htmlContent += `
          <div class="canvas-object" style="left: ${rectObj.left}px; top: ${rectObj.top}px; 
            width: ${rectObj.width}px; height: ${rectObj.height}px; background-color: ${rectObj.fill};">
          </div>
        `;
      }
      // Add more cases for other object types (circles, lines, etc.) as needed
    });
  
    htmlContent += `
          </div>
        </body>
      </html>
    `;
    
    return htmlContent;
  }
  

  public saveCanvasToJSON() {
    this.canvas.saveCanvasToJSON();
  }

  public loadCanvasFromJSON() {
    this.canvas.loadCanvasFromJSON();
  }

  public confirmClear() {
    this.canvas.confirmClear();
  }

  public changeSize() {
    this.canvas.changeSize();
  }

  public addText() {
    this.canvas.addText();
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
  }

  public bringToFront() {
    this.canvas.bringToFront();
  }

  public clone() {
    this.canvas.clone();
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

  public drawMode() {
    this.canvas.drawingMode();
  }

  public changeFigureColor(color){
    this.canvas.changeFigureColor(color);
  }

  onObjectColorChange(e){
    console.log(e)
    this.changeFigureColor(e.target.value)
  }
}
