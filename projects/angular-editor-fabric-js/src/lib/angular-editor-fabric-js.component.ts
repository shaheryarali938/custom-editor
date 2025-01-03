import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fabric } from 'fabric';

@Component({
  selector: 'angular-editor-fabric-js',
  templateUrl: './angular-editor-fabric-js.component.html',
  styleUrls: ['./angular-editor-fabric-js.component.css'],
})
export class FabricjsEditorComponent implements AfterViewInit {
  @ViewChild('htmlCanvas') htmlCanvas: ElementRef;

  private canvas: fabric.Canvas;
  public props = {
    canvasFill: '#ffffff',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: '',
  };

  public textString: string;
  public url: string | ArrayBuffer = '';
  public size: any = {
    width: 500,
    height: 700,
    bleed: 10,
  };
  public safetyArea: fabric.Rect;

  public json: any;
  private globalEditor = false;
  public textEditor = false;
  private imageEditor = false;
  public figureEditor = false;
  public selected: any;

  constructor() { }

  ngAfterViewInit(): void {
    // setup front side canvas
    this.canvas = new fabric.Canvas(this.htmlCanvas.nativeElement, {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      isDrawingMode: true
    });

    this.canvas.on({
      'object:moving': (e) => {
        this.addSafeAreaAndBleed(e)
      },
      'object:modified': (e) => { 
      },
      'object:selected': (e) => {
        const selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {

          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              break;
            case 'image':
              break;
          }
        }
      },
      'selection:cleared': (e) => {
        this.selected = null;
        this.resetPanels();
      }
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    this.addDashedSafetyArea();

    // get references to the html canvas element & its context
    this.canvas.on('mouse:down', (e) => {
      const canvasElement: any = document.getElementById('canvas');
    });

  }


  /*------------------------Block elements------------------------*/

  // Block "Size"

  addSafeAreaAndBleed(event: fabric.IEvent): void {
    const padding = this.size.bleed;
    const movingObject = event.target;
    const canvasHeight = movingObject.canvas.getHeight();
    const canvasWidth = movingObject.canvas.getWidth();
  
    // if movingObject is too big ignore
    if (movingObject.getBoundingRect().height > canvasHeight - padding * 2 ||
        movingObject.getBoundingRect().width > canvasWidth - padding * 2) {
      return;
    }
  
    movingObject.setCoords();
  
    const boundingRect = movingObject.getBoundingRect();
  
    // top-left corner
    if (boundingRect.top < padding) {
      movingObject.top = padding - boundingRect.top + movingObject.top;
    }
    if (boundingRect.left < padding) {
      movingObject.left = padding - boundingRect.left + movingObject.left;
    }
  
    // bottom-right corner
    if (boundingRect.top + boundingRect.height > canvasHeight - padding) {
      movingObject.top = canvasHeight - boundingRect.height - padding - (boundingRect.top - movingObject.top);
    }
    if (boundingRect.left + boundingRect.width > canvasWidth - padding) {
      movingObject.left = canvasWidth - boundingRect.width - padding - (boundingRect.left - movingObject.left);
    }
  
    movingObject.setCoords();
  }

  changeSize() {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    this.addDashedSafetyArea();
  }

  changeSizeWithMeasures(height: number, width: number) {
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    this.addDashedSafetyArea();
  }

  addDashedSafetyArea(): void {
    if (!this.size.bleed || this.size.bleed < 0) {
      console.warn("Invalid bleed value. Skipping safety area update.");
      return;
    }
  
    if (this.safetyArea) {
      this.canvas.remove(this.safetyArea);
    }
  
    const padding = this.size.bleed;
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
  
    this.safetyArea = new fabric.Rect({
      left: padding,
      top: padding,
      width: canvasWidth - padding * 2,
      height: canvasHeight - padding * 2,
      fill: 'transparent',
      stroke: 'grey',
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true
    });
  
    this.canvas.add(this.safetyArea);
    this.canvas.sendToBack(this.safetyArea);
  }

  // Block "Add text"

  addText() {
    if (this.textString) {
      const text = new fabric.IText(this.textString, {
        left: 10,
        top: 10,
        fontFamily: 'helvetica',
        angle: 0,
        fill: '#000000',
        scaleX: 0.5,
        scaleY: 0.5,
        fontWeight: '',
        hasRotatingPoint: true
      });

      this.extend(text, this.randomId());
      this.canvas.add(text);
      this.selectItemAfterAdded(text);
      this.textString = '';
    }
  }

  // Block "Add images"

  getImgPolaroid(event: any) {
    const el = event.target;
    const imageUrl = el.src;
  
    // Check if the image is an SVG or PNG
    if (imageUrl.endsWith('.svg')) {
      fabric.loadSVGFromURL(imageUrl, (objects, options) => {
        const image = fabric.util.groupSVGElements(objects, options);
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true,
        });
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    } else if (imageUrl.endsWith('.png')) {
      fabric.Image.fromURL(imageUrl, (image) => {
        // Set the desired initial width and height
        const initialWidth = 150; // Adjust this value as needed
        const initialHeight = 150; // Adjust this value as needed

        // Calculate the scale factors
        const scaleX = initialWidth / image.width;
        const scaleY = initialHeight / image.height;
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true,
          scaleX: scaleX,
          scaleY: scaleY
        });
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  // Block "Upload Image"

  addImageOnCanvas(url) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true
        });
        image.scaleToWidth(200);
        image.scaleToHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        this.url = readerEvent.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  }

  // Block "Add figure"

  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200, height: 100, left: 10, top: 10, angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100, height: 100, left: 10, top: 10, angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50, left: 10, top: 10, fill: '#ff5722'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  changeFigureColor(color) {
    this.canvas.getActiveObject().set("fill", color);
    this.canvas.renderAll();
  };

  /*Canvas*/

  cleanSelect() {
    this.canvas.discardActiveObject().renderAll();
  }

  // New method to expose the private canvas
  public getCanvas(): fabric.Canvas {
    return this.canvas;
  }

  selectItemAfterAdded(obj) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = ((toObject) => {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          id
        });
      };
    })(obj.toObject);
  }

  setCanvasImage() {
    const self = this;
    if (this.props.canvasImage) {
      this.canvas.setBackgroundColor(new fabric.Pattern({ source: this.props.canvasImage, repeat: 'repeat' }), () => {
        self.props.canvasFill = '';
        self.canvas.renderAll();
      });
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) { return ''; }

    if (object.getSelectionStyles && object.isEditing) {
      return (object.getSelectionStyles()[styleName] || '');
    } else {
      return (object[styleName] || '');
    }
  }

  setActiveStyle(styleName, value: string | number, object: fabric.IText) {
    object = object || this.canvas.getActiveObject() as fabric.IText;
    if (!object) { return; }

    if (object.setSelectionStyles && object.isEditing) {
      const style = {};
      style[styleName] = value;

      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.setSelectionStyles({ underline: true });
        } else {
          object.setSelectionStyles({ underline: false });
        }

        if (value.includes('overline')) {
          object.setSelectionStyles({ overline: true });
        } else {
          object.setSelectionStyles({ overline: false });
        }

        if (value.includes('line-through')) {
          object.setSelectionStyles({ linethrough: true });
        } else {
          object.setSelectionStyles({ linethrough: false });
        }
      }

      object.setSelectionStyles(style);
      object.setCoords();

    } else {
      if (typeof value === 'string') {
        if (value.includes('underline')) {
          object.set('underline', true);
        } else {
          object.set('underline', false);
        }

        if (value.includes('overline')) {
          object.set('overline', true);
        } else {
          object.set('overline', false);
        }

        if (value.includes('line-through')) {
          object.set('linethrough', true);
        } else {
          object.set('linethrough', false);
        }
      }

      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }


  getActiveProp(name) {
    const object = this.canvas.getActiveObject();
    if (!object) { return ''; }

    return object[name] || '';
  }

  setActiveProp(name, value) {
    const object = this.canvas.getActiveObject();
    if (!object) { return; }
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  clone() {
    const activeObject = this.canvas.getActiveObject();
    const activeGroup = this.canvas.getActiveObjects();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    const val = this.props.id;
    const complete = this.canvas.getActiveObject().toObject();
    console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity, 10) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize, 10), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    if (this.props.fontStyle) {
      this.setActiveStyle('fontStyle', 'italic', null);
    } else {
      this.setActiveStyle('fontStyle', 'normal', null);
    }
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  /*System*/

  removeSelected() {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length) {
      this.canvas.discardActiveObject();
      activeObjects.forEach((object) => {
        this.canvas.remove(object);
      });
      this.canvas.renderAll();
    } 
  }

  bringToFront() {
    const activeObjects = this.canvas.getActiveObjects();
    console.log('Bringing objects to front:', activeObjects); // Debugging: Log the objects to be brought to front
  
    if (activeObjects.length) {
      activeObjects.forEach((object) => {
        this.canvas.bringToFront(object);
        object.setCoords(); // Ensure the object's coordinates are updated
      });
      this.canvas.discardActiveObject();
      this.canvas.renderAll(); // Ensure the canvas is re-rendered after bringing objects to front
      console.log('Objects brought to front successfully'); // Debugging: Confirm action
    } else {
      console.log('No active objects to bring to front'); // Debugging: Log if no objects are selected
    }
  }
  
  sendToBack() {
    const activeObjects = this.canvas.getActiveObjects();
    console.log('Sending objects to back:', activeObjects); // Debugging: Log the objects to be sent to back
  
    if (activeObjects.length) {
      activeObjects.forEach((object) => {
        this.canvas.sendToBack(object);
        object.setCoords(); // Ensure the object's coordinates are updated
      });
      this.canvas.discardActiveObject();
      this.canvas.renderAll(); // Ensure the canvas is re-rendered after sending objects to back
      console.log('Objects sent to back successfully'); // Debugging: Confirm action
    } else {
      console.log('No active objects to send to back'); // Debugging: Log if no objects are selected
    }
  }

  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
    }
  }


  exportToHtml() {
    // Get the content from the canvas (or editor).
    const editorContent = this.getEditorContentAsHtml();  // Replace this with your actual method to extract HTML content from the editor.
  
    // Create a Blob object with HTML content
    const blob = new Blob([editorContent], { type: 'text/html' });
  
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = Date.now() + '.html';  // Name the HTML file
  
    // Trigger the click to start the download and remove the link element
    link.click();
    link.remove();
  }
  
  // Method to retrieve editor content in HTML (you will need to replace this with your actual method)
  getEditorContentAsHtml(): string {
    // This method should return the HTML of your editor's content
    // For example, if you're using Fabric.js, you may want to extract the canvas content as HTML, or if you're using an iframe for editing, you can get the content of that iframe.
    const content = this.canvas.toSVG();  // You can adjust this based on the editor you're using
    return content;  // Return as HTML string
  }
  

  rasterize() {
    // Temporarily remove the safety area
    if (this.safetyArea) {
      this.canvas.remove(this.safetyArea);
    }
    
    const image = new Image();
    image.src = this.canvas.toDataURL({ format: 'png' });
    const w = window.open('');
    w.document.write(image.outerHTML);
    this.downLoadImage();
  }

  downLoadImage() {
    const c = this.canvas.toDataURL({ format: 'png' });
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = c;
    downloadLink.target = '_self';
    downloadLink.download = Date.now() + '.png';
    downloadLink.click();
  }

  rasterizeSVG() {
    const w = window.open('');
    w.document.write(this.canvas.toSVG());
    this.downLoadSVG();
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
  }

  downLoadSVG() {
    const c = 'data:image/svg+xml;utf8,' + encodeURIComponent(this.canvas.toSVG());
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = c;
    downloadLink.target = '_self';
    downloadLink.download = Date.now() + '.svg';
    downloadLink.click();
  }

  saveCanvasToJSON() {
    const json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    console.log('json');
    console.log(json);

  }

  loadCanvasFromJSON() {
    const CANVAS = localStorage.getItem('Kanvas');
    console.log('CANVAS');
    console.log(CANVAS);

    // and load everything from the same json
    this.canvas.loadFromJSON(CANVAS, () => {
      console.log('CANVAS untar');
      console.log(CANVAS);

      // making sure to render canvas at the end
      this.canvas.renderAll();

      // and checking if object's "name" is preserved
      console.log('this.canvas.item(0).name');
      console.log(this.canvas);
    });

  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

  drawingMode() {
    this.canvas.isDrawingMode = !this.canvas.isDrawingMode;
  }

}
