import { Component, OnInit, ViewChild } from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';
import { fabric } from 'fabric';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
 fontSizes: number[] = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64];
selectedFontSize: number = 24; // Default font size

isFront: boolean = true; // Tracks whether the front side is active
frontCanvas: fabric.Canvas;
backCanvas: fabric.Canvas;

frontCanvasData: any | null = null; // Stores JSON data for the front canvas
backCanvasData: any | null = null;  // Stores JSON data for the back canvas


@ViewChild('canvas', { static: false }) canvas: FabricjsEditorComponent;

toggleSide() {
  const canvasJSON = this.canvas.getCanvas().toJSON();

  if (this.isFront) {
    this.frontCanvasData = canvasJSON; // Save front side design
    this.canvas.getCanvas().clear(); // Clear the canvas
    if (this.backCanvasData) {
      this.canvas.getCanvas().loadFromJSON(this.backCanvasData, () => {
        this.canvas.getCanvas().renderAll(); // Render back side
        this.addDashedSafetyArea();
      });
    }
  } else {
    this.backCanvasData = canvasJSON; // Save back side design
    this.canvas.getCanvas().clear(); // Clear the canvas
    if (this.frontCanvasData) {
      this.canvas.getCanvas().loadFromJSON(this.frontCanvasData, () => {
        this.canvas.getCanvas().renderAll(); // Render front side
        this.addDashedSafetyArea();
      });
    }
  }

  this.isFront = !this.isFront; // Toggle side
  this.addDashedSafetyArea();
}


saveDesigns() {
  const canvasJSON = this.canvas.getCanvas().toJSON();

  if (this.isFront) {
    this.frontCanvasData = canvasJSON;
  } else {
    this.backCanvasData = canvasJSON;
  }

  console.log('Front Design:', this.frontCanvasData);
  console.log('Back Design:', this.backCanvasData);
}





// Add Text Method
addText() {
  if (!this.canvas.textString) return;

  const text = new fabric.Textbox(this.canvas.textString, {
    left: 100,
    top: 100,
    fontFamily: this.selectedFont,
    fontWeight: this.selectedFontWeight,
    fontStyle: this.isItalic ? 'italic' : 'normal',
    fontSize: this.selectedFontSize, // Use selected font size
    fill: '#000',
  });

  this.canvas.getCanvas().add(text);
  this.canvas.textString = ''; // Clear the input field
}

  title = 'angular-editor-fabric-js';

  activeTab: string = 'text';

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Default font properties
  selectedFont: string = 'Arial';
  selectedFontWeight: string = '400';
  isBold: boolean = false;
  isItalic: boolean = false;

  
  
  // @ViewChild('canvas', { static: false }) canvas: FabricjsEditorComponent;

  

  // Pre-built templates
  prebuiltTemplates = [
    {
      image: '../assets/img/283w-gp7mtx-pwXA.webp',
      text: 'Bird Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 200,
          fontSize: 20,
          fontFamily: 'Arial',
          text: 'Add text for Tea Party Template!',
          fill: '#000000',
        },
      ],
    },
    {
      image: '../assets/img/400w-elzoGX-60GY.webp',
      text: 'Branch Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 200,
          fontSize: 20,
          fontFamily: 'Arial',
          text: 'This is a Birthday Template!',
          fill: '#000000',
        },
      ],
    },
    {
      image: '../assets/img/1600w-yK5aaGtg5ag.webp',
      text: 'Merry Christmas Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: 'Arial',
          text: 'Merry Christmas!',
          fill: '#FF0000',
        },
      ],
    },
    {
      image: '../assets/img/1131w-XNBaqNbEN0g.webp',
      text: 'Hello Christmas Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: 'Arial',
          text: 'Hello Christmas!',
          fill: '#FF5733',
        },
      ],
    },
    {
      image: '../assets/img/400w-jwGZdB976qs.webp',
      text: 'Green & Purple Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: 'Arial',
          text: 'Green & Purple!',
          fill: '#28a745',
        },
      ],
    },
    {
      image: '../assets/img/283w-IMWozLAU4-Q.webp',
      text: 'Green & Purple Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: 'Arial',
          text: 'Green & Purple!',
          fill: '#28a745',
        },
      ],
    },
    {
      image: '../assets/img/283w-ZtJkm9u4ocI.webp',
      text: 'Green & Purple Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: 'Arial',
          text: 'Green & Purple!',
          fill: '#28a745',
        },
      ],
    },
    {
      image: '../assets/img/283w-j7P7DHcqJxU.webp',
      text: 'Travel Visit Template',
      objects: [
        {
          type: 'textbox',
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: 'Arial',
          text: 'Travel & Visit!',
          fill: '#007bff',
        },
      ],
    },
  ];
  

  // for images in the inside the image tab 
  images: string[] = [
  '../assets/img/bird.png',
  '../assets/img/branch.png',
  '../assets/img/candy-stick.png',
  '../assets/img/cat-animal.png',
  '../assets/img/christmas-ball.png',
  '../assets/img/christmas-decorations.png',
  '../assets/img/christmas-stocking.png',
  '../assets/img/christmas-tree.png',
  '../assets/img/christmas.png',
  '../assets/img/envelope.png',
  '../assets/img/hohoho.png',
  '../assets/img/holly.png',
  '../assets/img/letter.png',
  '../assets/img/love.png',
  '../assets/img/merry-christmas.png',
  '../assets/img/mug.png',
  '../assets/img/santa-claus.png',
  '../assets/img/santa-hat.png',
  '../assets/img/snow.png',
  '../assets/img/snowman.png',
  '../assets/img/wreath.png',
  '../assets/img/yes.png',
];

  

  // Selected template from dropdown
  selectedTemplate: any = null;

  ngOnInit() {
    const fontsToPreload = [
      'Roboto',
      'Open Sans',
      'Poppins',
      'Lato',
      'Montserrat',
      'Nunito',
      'Source Sans Pro',
      'PT Sans',
      'Georgia',
      'Playfair Display',
      'Merriweather',
      'Crimson Text',
      'Libre Baskerville',
      'Cormorant Garamond',
      'Lora',
      'PT Serif',
      'Oswald',
      'Bebas Neue',
      'Abril Fatface',
      'Pacifico',
      'Dancing Script',
      'Chewy',
      'Cookie',
      'Satisfy',
      'Courier New',
      'Lucida Console',
      'Fira Code',
      'Source Code Pro',
      'Inconsolata',
    ];

    fontsToPreload.forEach((font) => {
      if ('fonts' in document) {
        document.fonts
          .load(`16px ${font}`)
          .then(() => console.log(`Font "${font}" loaded.`))
          .catch((err) => console.warn(`Failed to load font "${font}":`, err));
      }
    });
  
    // Add event listeners for object selection
    this.canvas.getCanvas().on('selection:created', (e) => this.onTextObjectSelected(e.target));
    this.canvas.getCanvas().on('selection:updated', (e) => this.onTextObjectSelected(e.target));
    this.canvas.getCanvas().on('selection:cleared', () => this.clearTextSelection());

    this.frontCanvas = new fabric.Canvas('frontCanvas');
    this.backCanvas = new fabric.Canvas('backCanvas');
    this.backCanvas.dispose(); // Initially dispose of the back canvas

  }
  
  onFontFamilyChange() {
    const activeObject = this.canvas.getCanvas().getActiveObject();
  
    if (activeObject && activeObject.type === 'textbox') {
      const textbox = activeObject as fabric.Textbox; // Explicitly cast to Textbox
      textbox.set('fontFamily', this.selectedFont); // Update the font family
      this.canvas.getCanvas().renderAll(); // Re-render the canvas
    } else {
      console.warn('No text object selected or active object is not a textbox.');
    }
  }
  
  
  // addText() {
  //   if (!this.canvas.textString) return;

  //   const text = new fabric.Textbox(this.canvas.textString, {
  //     left: 100,
  //     top: 100,
  //     fontFamily: this.selectedFont,
  //     fontWeight: this.selectedFontWeight,
  //     fontStyle: this.isItalic ? 'italic' : 'normal',
  //     fontSize: 24,
  //     fill: '#000',
  //   });

  //   this.canvas.getCanvas().add(text);
  //   this.canvas.textString = '';
  // }

  

  updateSelectedText() {
    const activeObject = this.canvas.getCanvas().getActiveObject();
  
    if (activeObject && activeObject.type === 'textbox') {
      const textbox = activeObject as fabric.Textbox;
  
      // Update all font-related properties
      textbox.set('fontFamily', this.selectedFont);
      textbox.set('fontWeight', this.selectedFontWeight);
      textbox.set('fontStyle', this.isItalic ? 'italic' : 'normal');
      textbox.set('fontSize', this.selectedFontSize);
  
      // Re-render the canvas to reflect changes
      this.canvas.getCanvas().renderAll();
    } else {
      console.warn('No text object selected or active object is not a textbox.');
    }
  }
  

  onFontSizeChange() {
    const activeObject = this.canvas.getCanvas().getActiveObject();
  
    if (activeObject && activeObject.type === 'textbox') {
      const textbox = activeObject as fabric.Textbox; // Cast to Textbox
      textbox.set('fontSize', this.selectedFontSize); // Update the font size
      this.canvas.getCanvas().renderAll(); // Re-render the canvas
    } else {
      console.warn('No text object selected or active object is not a textbox.');
    }
  }

  
  
  
  
  
  // Bind font properties to selected text
  onTextObjectSelected(target: any) {
    if (target && target.type === 'textbox') {
      this.selectedFont = target.fontFamily || 'Arial';
      this.selectedFontWeight = target.fontWeight || '400';
      this.isBold = this.selectedFontWeight === '700';
      this.isItalic = target.fontStyle === 'italic';
      this.selectedFontSize = target.fontSize || 24; // Update the font size
    }
  }
  
  // Clear selection when no text is active
  clearTextSelection() {
    this.selectedFont = 'Arial';
    this.selectedFontWeight = '400';
    this.isBold = false;
    this.isItalic = false;
  }
  

  toggleBold() {
    this.isBold = !this.isBold;
    this.selectedFontWeight = this.isBold ? '700' : '400';
    this.updateSelectedText();
  }
  

  toggleItalic() {
    this.isItalic = !this.isItalic;
    this.updateSelectedText();
  }

  loadImageTemplate(template: any) {
    this.canvas.loadImageTemplate(template);
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
  
        this.canvas.getCanvas().setBackgroundImage(
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
  
          this.canvas.getCanvas().setBackgroundImage(
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
    this.addDashedSafetyArea();
  }

  public rasterizeSVG() {
    this.canvas.rasterizeSVG();
    this.addDashedSafetyArea();
  }

  public exportToHtml() {
    this.canvas.exportToHtml();
    this.addDashedSafetyArea();
  }

  public saveCanvasToJSON() {
    this.canvas.saveCanvasToJSON();
    this.addDashedSafetyArea();
  }

  public loadCanvasFromJSON() {
    this.canvas.loadCanvasFromJSON();
    this.addDashedSafetyArea();
  }

  public confirmClear() {
    this.canvas.confirmClear();
    this.addDashedSafetyArea();
  }

  // public changeBleedSize() {
  //   this.canvas.changeBleedSize();
  // }

  public changeSizeWithMeasures(height: number, width: number) {
    // Clear the canvas before applying new size
    this.canvas.getCanvas().clear();
    this.frontCanvasData = null;
    this.backCanvasData = null;
    // Call the existing changeSizeWithMeasures function in fabric.ts
    this.canvas.changeSizeWithMeasures(height, width);
    this.addDashedSafetyArea();
  
    console.log(`Canvas size changed to ${width}x${height}`);
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
      fill: '#000',
    });
  
    this.canvas.getCanvas().add(text);
    this.canvas.textString = ''; // Clear the input field
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

  public clone() {
    this.canvas.clone();
    this.addDashedSafetyArea();
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

  onObjectColorChange(e) {
    console.log(e);
    this.changeFigureColor(e.target.value);
  }
}