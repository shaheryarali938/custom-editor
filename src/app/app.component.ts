import { Component, OnInit, ViewChild } from '@angular/core';
import { FabricjsEditorComponent } from 'projects/angular-editor-fabric-js/src/public-api';
import { fabric } from 'fabric'; // Import fabric.js

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-editor-fabric-js';

  // Default font properties
  selectedFont: string = 'Arial';
  selectedFontWeight: string = '400'; // Default font weight (Normal)
  isBold: boolean = false; // Track if bold is applied
  isItalic: boolean = false; // Track if italic is applied

  @ViewChild('canvas', { static: false }) canvas: FabricjsEditorComponent;

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
          .then(() => {
            console.log(`Font "${font}" loaded successfully.`);
          })
          .catch((err) => {
            console.warn(`Failed to load font "${font}":`, err);
          });
      }
    });
  }

  // Toggle Bold
  toggleBold() {
    this.isBold = !this.isBold;
    this.selectedFontWeight = this.isBold ? '700' : '400'; // Bold = 700, Normal = 400
  }

  // Toggle Italic
  toggleItalic() {
    this.isItalic = !this.isItalic;
  }

  // Add Text to Canvas
  addText() {
    if (!this.canvas.textString) {
      console.error('No text entered!');
      return; // Exit if no text is entered
    }

    const text = new fabric.Textbox(this.canvas.textString, {
      left: 100,
      top: 100,
      fontFamily: this.selectedFont, // Selected font family
      fontWeight: this.selectedFontWeight, // Apply selected font weight
      fontStyle: this.isItalic ? 'italic' : 'normal', // Apply italic style if enabled
      fontSize: 24, // Default font size
      fill: '#000', // Default text color
    });

    this.canvas.getCanvas().add(text); // Add text to the canvas
    this.canvas.textString = ''; // Clear input field
  }

  // Load Template
  loadTemplate() {
    if (!this.selectedTemplate) {
      console.error('No template selected!');
      return;
    }

    const templateData = JSON.parse(this.selectedTemplate.data);

    // Clear the canvas before loading the template
    this.canvas.getCanvas().clear();

    // Load background color if specified
    if (templateData.background) {
      this.canvas.getCanvas().setBackgroundColor(
        templateData.background,
        this.canvas.getCanvas().renderAll.bind(this.canvas.getCanvas())
      );
    }

    // Load objects onto the canvas
    fabric.util.enlivenObjects(
      templateData.objects,
      (objects) => {
        objects.forEach((obj) => {
          this.canvas.getCanvas().add(obj);
        });
        this.canvas.getCanvas().renderAll();
      },
      null
    );

    console.log(`Loaded template: ${this.selectedTemplate.name}`);
  }





  loadImageTemplate(template: any) {
    if (!template) {
      console.error('No template selected!');
      return;
    }
  
    // Clear the canvas
    this.canvas.getCanvas().clear();
  
    // Add the image to the canvas
    fabric.Image.fromURL(template.image, (img) => {
      img.set({
        left: 50,
        top: 50,
      });
      this.canvas.getCanvas().add(img);
  
      // Add text objects from the template
      template.objects.forEach((obj: any) => {
        const text = new fabric.Textbox(obj.text, {
          left: obj.left,
          top: obj.top,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
          fill: obj.fill,
          width: obj.width,
        });
        this.canvas.getCanvas().add(text);
      });
  
      this.canvas.getCanvas().renderAll();
    });
  
    console.log(`Loaded template: ${template.text}`);
  }
  


  // Export methods (unchanged)
  public rasterize() {
    this.canvas.rasterize();
  }

  public rasterizeSVG() {
    this.canvas.rasterizeSVG();
  }

  public exportToHtml() {
    this.canvas.exportToHtml();
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

  public changeBleedSize() {
    this.canvas.changeBleedSize();
  }

  public changeSizeWithMeasures(height: number, width: number) {
    this.canvas.changeSizeWithMeasures(height, width);
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

  public changeFigureColor(color) {
    this.canvas.changeFigureColor(color);
  }

  onObjectColorChange(e) {
    console.log(e);
    this.changeFigureColor(e.target.value);
  }
}