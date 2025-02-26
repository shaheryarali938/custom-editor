import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FabricjsEditorComponent } from "projects/angular-editor-fabric-js/src/public-api";
import { fabric } from "fabric";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @ViewChild('canvasEditor', { static: false }) canvasEditor!: FabricjsEditorComponent;

  ngAfterViewInit() {
    // Canvas is now initialized inside the editor component
  }

  /** Import (Load) Saved Canvas */
/** Import SVG File and Preserve Bleed Area */
loadCanvas() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/svg+xml';

  input.addEventListener('change', (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const svgString = e.target?.result as string;
        const fabricCanvas = this.canvas.getCanvas(); // Get Fabric.js instance

        fabricCanvas.clear(); // Clear previous objects before loading new one

        fabric.loadSVGFromString(svgString, (objects, options) => {
          const editableObjects: fabric.Object[] = [];

          objects.forEach((obj) => {
            if (obj instanceof fabric.Text || obj instanceof fabric.IText) {
              const textObj = new fabric.Textbox((obj as fabric.Text).text || '', {
                left: obj.left || 0,
                top: obj.top || 0,
                fontFamily: (obj as fabric.Text).fontFamily || 'Arial',
                fontSize: (obj as fabric.Text).fontSize || 20,
                fill: (obj as fabric.Text).fill || '#000',
                width: obj.width || 200,
                selectable: true,
                evented: true,
                editable: true,
                hasControls: true,
                hasBorders: true
              });

              editableObjects.push(textObj);
            } else {
              obj.set({
                selectable: true,
                evented: true,
                hasControls: true,
                hasBorders: true,
                hoverCursor: 'move'
              });

              editableObjects.push(obj);
            }
          });

          // Add elements to canvas
          editableObjects.forEach((obj) => fabricCanvas.add(obj));

          fabricCanvas.renderAll();

          // ✅ Re-add the bleed lines after import
          this.addDashedSafetyArea();

          alert('SVG Template Imported Successfully! Editable text is now enabled.');
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

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Default font properties
  selectedFont: string = "Arial";
  selectedFontWeight: string = "400";
  isBold: boolean = false;
  isItalic: boolean = false;

  // @ViewChild('canvas', { static: false }) canvas: FabricjsEditorComponent;

  // Pre-built templates
  prebuiltTemplates = [
    // {
    //   image: "../assets/img/283w-gp7mtx-pwXA.webp",
    //   text: "Bird Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 200,
    //       fontSize: 20,
    //       fontFamily: "Arial",
    //       text: "Add text for Tea Party Template!",
    //       fill: "#000000",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/400w-elzoGX-60GY.webp",
    //   text: "Branch Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 200,
    //       fontSize: 20,
    //       fontFamily: "Arial",
    //       text: "This is a Birthday Template!",
    //       fill: "#000000",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/1600w-yK5aaGtg5ag.webp",
    //   text: "Merry Christmas Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 300,
    //       fontSize: 30,
    //       fontFamily: "Arial",
    //       text: "Merry Christmas!",
    //       fill: "#FF0000",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/1131w-XNBaqNbEN0g.webp",
    //   text: "Hello Christmas Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 300,
    //       fontSize: 30,
    //       fontFamily: "Arial",
    //       text: "Hello Christmas!",
    //       fill: "#FF5733",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/400w-jwGZdB976qs.webp",
    //   text: "Green & Purple Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 300,
    //       fontSize: 30,
    //       fontFamily: "Arial",
    //       text: "Green & Purple!",
    //       fill: "#28a745",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/283w-IMWozLAU4-Q.webp",
    //   text: "Green & Purple Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 300,
    //       fontSize: 30,
    //       fontFamily: "Arial",
    //       text: "Green & Purple!",
    //       fill: "#28a745",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/283w-ZtJkm9u4ocI.webp",
    //   text: "Green & Purple Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 300,
    //       fontSize: 30,
    //       fontFamily: "Arial",
    //       text: "Green & Purple!",
    //       fill: "#28a745",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/283w-j7P7DHcqJxU.webp",
    //   text: "Travel Visit Template",
    //   objects: [
    //     {
    //       type: "textbox",
    //       left: 150,
    //       top: 20,
    //       width: 300,
    //       fontSize: 30,
    //       fontFamily: "Arial",
    //       text: "Travel & Visit!",
    //       fill: "#007bff",
    //     },
    //   ],
    // },




    
    // {
    //   image: "../assets/img/NewDoodles - Arrow (Blue)_page-0001.jpg",
    //   text: "Real Estate Template", // Name of the template
    //   objects: [
    //     // Permit Indicia Text
    //     {
    //       type: "textbox",
    //       left: 310,
    //       top: 0,
    //       width: 70,
    //       height: 52,
    //       fontSize: 7,
    //       fontFamily: "Myriad Pro",
    //       text: "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
    //       fill: "#000000",
    //       textAlign: "center",
    //       lineHeight: 1.2,
    //     },
    //     // Red Text Box
    //     {
    //       type: "textbox",
    //       left: -4,
    //       top: -1,
    //       width: 252,
    //       height: 46,
    //       fontSize: 10,
    //       fontFamily: "Your Font",
    //       text: "I can pay you cash for your house, so please, contact me ASAP if you'd like to sell.",
    //       fill: "#D9002E",
    //       padding: 4,
    //     },
    //     // Image 1
    //     {
    //       type: "image",
    //       left: 245,
    //       top: 52,
    //       width: 166,
    //       height: 79,
    //       src: "../assets/img/candy-stick.png", // Replace with the actual image path
    //     },
    //     // Image 2
    //     {
    //       type: "image",
    //       left: 375,
    //       top: 458,
    //       width: 110,
    //       height: 52,
    //       src: "../assets/img/candy-stick.png", // Replace with the actual image path
    //     },
    //     // Flip Over Text
    //     {
    //       type: "textbox",
    //       left: 118,
    //       top: 122,
    //       width: 362,
    //       height: 35,
    //       fontSize: 10,
    //       fontFamily: "Your Font",
    //       text: "Flip over for something very important!",
    //       fill: "#D9002E",
    //     },
    //     // Image 3
    //     {
    //       type: "image",
    //       left: 278,
    //       top: 127,
    //       width: 202,
    //       height: 38,
    //       src: "../assets/img/NewDoodles - Arrow (Blue)_page-0001.jpg", // Replace with the actual image path
    //     },
    //     // Main Text Box
    //     {
    //       type: "textbox",
    //       left: 0,
    //       top: 467,
    //       width: 472,
    //       height: 351,
    //       fontSize: 10,
    //       fontFamily: "Your Font",
    //       text: "Hi [Name],\nMy name is [Your Name] and\nI want to buy your house at\n[Address]\nI can pay you CASH no matter\nwhat the condition is of the home.\nCall me now to receive a Fair Cash Offer!\n\n[Phone Number]\n\nP.S. No Realtor Fees, No Appraisals,\nNo Repairs, No Hassles!\nCall Me Right Away!",
    //       fill: "#D9002E",
    //       textAlign: "center",
    //       padding: 4,
    //     },
    //     // Address Text Box
    //     {
    //       type: "textbox",
    //       left: 134,
    //       top: 186,
    //       width: 337,
    //       height: 30,
    //       fontSize: 13,
    //       fontFamily: "Ctorres",
    //       text: "[Address Line 1]\n[Address Line 2]",
    //       fill: "#000000",
    //       padding: 4,
    //     },
    //     // Image 4
    //     {
    //       type: "image",
    //       left: 0,
    //       top: 76,
    //       width: 100,
    //       height: 97,
    //       src: "../assets/img/NewDoodles - Arrow (Blue)_page-0001.jpg", // Replace with the actual image path
    //     },
    //     // Contact Info Text Box
    //     {
    //       type: "textbox",
    //       left: 134,
    //       top: 223,
    //       width: 307,
    //       height: 67,
    //       fontSize: 10,
    //       fontFamily: "Your Font",
    //       text: "[Your Name]\n[Your Phone Number]\n[Your Email Address]",
    //       fill: "#D9002E",
    //       padding: 4,
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/DOODLES_0001_Layer-3 (1).png",
    //   text: "Real Estate Template", // Name of the template
    //   objects: [
    //     // Permit Indicia Text
    //     {
    //       type: "textbox",
    //       left: 410,
    //       top: 0,
    //       width: 70,
    //       height: 52,
    //       fontSize: 7,
    //       fontFamily: "Myriad Pro",
    //       text: "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
    //       fill: "#000000",
    //       textAlign: "center",
    //       lineHeight: 1.2,
    //     },
    //     // Headline Text
    //     {
    //       type: "textbox",
    //       left: 0,
    //       top: 63,
    //       width: 480,
    //       height: 174,
    //       fontSize: 24,
    //       fontFamily: "Arial Rounded MT Bold",
    //       text: "Don't throw away this postcard, I have solutions for situations like yours!",
    //       fill: "#000000",
    //       textAlign: "center",
    //     },
    //     // Contact Info
    //     {
    //       type: "textbox",
    //       left: 561,
    //       top: 413,
    //       width: 480,
    //       height: 256,
    //       fontSize: 18,
    //       fontFamily: "Arial Rounded MT Bold",
    //       text: "[FirstName],\n\nAre you worried about foreclosure?\nUnsure who to trust with a short sale?\nDon't worry—we're here to help with solutions tailored just for you!",
    //       fill: "#FF732E",
    //       textAlign: "center",
    //     },
    //     // Call to Action
    //     {
    //       type: "textbox",
    //       left: 0,
    //       top: 438,
    //       width: 480,
    //       height: 257,
    //       fontSize: 16,
    //       fontFamily: "Arial Rounded MT Bold",
    //       text: "Email/Call/Text [AgentName] today!\n(support@yellowletterhq.com)\n[AgentNumber]",
    //       fill: "#FF732E",
    //       textAlign: "center",
    //     },
    //     // Image 1
    //     {
    //       type: "image",
    //       left: 203,
    //       top: 695,
    //       width: 72,
    //       height: 101,
    //       src: "../assets/img/DOODLES_0001_Layer-3.png", // Replace with the actual image path
    //     },
    //     // Image 2
    //     {
    //       type: "image",
    //       left: 285,
    //       top: 696,
    //       width: 103,
    //       height: 102,
    //       src: "../assets/img/DOODLES_0001_Layer-3.png", // Replace with the actual image path
    //     },
    //     // Image 3
    //     {
    //       type: "image",
    //       left: 126,
    //       top: 696,
    //       width: 66,
    //       height: 102,
    //       src: "../assets/img/DOODLES_0004_Layer-3.png", // Replace with the actual image path
    //     },
    //     // Image 4
    //     {
    //       type: "image",
    //       left: 22,
    //       top: 696,
    //       width: 92,
    //       height: 101,
    //       src: "../assets/img/DOODLES_0002_Layer-3.png", // Replace with the actual image path
    //     },
    //     // Image 5
    //     {
    //       type: "image",
    //       left: 399,
    //       top: 695,
    //       width: 60,
    //       height: 102,
    //       src: "../assets/img/DOODLES_0003_Layer-3.png", // Replace with the actual image path
    //     }
    //   ], 
    // },
    // {
    //   image: "../assets/img/NewDoodles.jpg", // Replace with actual image path
    //   text: "Realistic Handwritten Template", // Name of the template
    //   objects: [
    //     // Permit Indicia Text
    //     {
    //       type: "textbox",
    //       left: 410,
    //       top: -15,
    //       width: 70,
    //       height: 52,
    //       fontSize: 7,
    //       fontFamily: "Myriad Pro",
    //       text: "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
    //       fill: "#000000",
    //       textAlign: "center",
    //       lineHeight: 1.2,
    //     },
    //     // Red Text Box
    //     {
    //       type: "textbox",
    //       left: -9,
    //       top: -17,
    //       width: 382,
    //       height: 55,
    //       fontSize: 14,
    //       fontFamily: "Ctorres",
    //       text: "",
    //       fill: "#D9002E",
    //       padding: 8,
    //     },
    //     // Image 1 (Top Image, resized)
    //     {
    //       type: "image",
    //       left: 126,
    //       top: 144,
    //       width: 180, // Adjusted size (reduced)
    //       height: 100, // Adjusted size (reduced)
    //       src: "../assets/img/realistic_template.png", // Replace with actual image path
    //     },
    //     // Main Text Box
    //     {
    //       type: "textbox",
    //       left: 0,
    //       top: 424,
    //       width: 480,
    //       height: 363,
    //       fontSize: 14,
    //       fontFamily: "Ctorres",
    //       text: "Hey [Name],\nApologies for my random note, but I wanted to write you personally about your house located at [Address]. I am looking to buy a home in your neighborhood and your home seems perfect for what I am looking for.\n\nCould we possibly discuss making you a cash offer? Either way, please let me know.\n\nBlessings,\n[Your Name]",
    //       fill: "#D9002E",
    //       padding: 8,
    //       textAlign: "left",
    //     },
    //     // Address Text Box
    //     {
    //       type: "textbox",
    //       left: 126,
    //       top: 181,
    //       width: 342,
    //       height: 153,
    //       fontSize: 14,
    //       fontFamily: "Ctorres",
    //       text: "[Address Line 1]\n[Address Line 2]",
    //       fill: "#D9002E",
    //       padding: 6,
    //     },
    //     // Contact Info Text Box
    //     {
    //       type: "textbox",
    //       left: 91,
    //       top: 310,
    //       width: 413,
    //       height: 60,
    //       fontSize: 12,
    //       fontFamily: "Ctorres",
    //       text: "[Your Name]\n[Your Phone Number]\n[Your Email Address]",
    //       fill: "#D9002E",
    //       textAlign: "center",
    //     },
    //   ],
    // },
    // {
    //   image: "../assets/img/flower.jpg", // Replace with actual image path
    //   text: "Flower Theme Template", // Name of the template
    //   objects: [
    //     // Permit Indicia Text
    //     {
    //       type: "textbox",
    //       left: 400,
    //       top: -1,
    //       width: 80,
    //       height: 52,
    //       fontSize: 7,
    //       fontFamily: "Myriad Pro",
    //       text: "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
    //       fill: "#000000",
    //       textAlign: "center",
    //       lineHeight: 1.2,
    //     },
    //     // Red Text Box (Top Message)
    //     {
    //       type: "textbox",
    //       left: -7,
    //       top: -11,
    //       width: 343,
    //       height: 87,
    //       fontSize: 18,
    //       fontFamily: "astPea",
    //       text: "",
    //       fill: "#D9002E",
    //       padding: 4,
    //     },
    //     // Image 1 (Top Image, resized)
    //     {
    //       type: "image",
    //       left: 102,
    //       top: 163,
    //       width: 180, // Adjusted size (reduced)
    //       height: 120, // Adjusted size (reduced)
    //       src: "../assets/img/flower_template.png", // Replace with actual image path
    //     },
    //     // Address Text Box
    //     {
    //       type: "textbox",
    //       left: 102,
    //       top: 163,
    //       width: 381,
    //       height: 200,
    //       fontSize: 14,
    //       fontFamily: "Lindy Med Blur",
    //       text: "[Address Line 1]\n[Address Line 2]",
    //       fill: "#D9002E",
    //       padding: 10,
    //     },
    //     // Contact Info Text Box
    //     {
    //       type: "textbox",
    //       left: 0,
    //       top: 73,
    //       width: 135,
    //       height: 21,
    //       fontSize: 6,
    //       fontFamily: "Your Font",
    //       text: "[Your Name]\n[Your Phone Number]\n[Your Email Address]",
    //       fill: "#D9002E",
    //       textAlign: "left",
    //     },
    //     // Rotated PDF Image
    //     {
    //       type: "image",
    //       left: 51,
    //       top: 356,
    //       width: 250, // Resized to fit better
    //       height: 335, // Resized to fit better
    //       angle: -90, // Rotated
    //       src: "../assets/img/flower_pdf_preview.png", // Replace with actual image path
    //     },
    //     // Main Text Box (Bottom Message)
    //     {
    //       type: "textbox",
    //       left: 113,
    //       top: 433,
    //       width: 335,
    //       height: 361,
    //       fontSize: 10,
    //       fontFamily: "astPea",
    //       text: "Dear [Name],\nWould you consider an offer on [Address]?\nCall me at [Phone Number] when you have a chance.\nSincerely,\n[Your Name]",
    //       fill: "#D9002E",
    //       padding: 4,
    //       textAlign: "left",
    //     },
    //   ],
    // },
    // {
    //   "image": "../assets/img/NewDoodles1.jpg", // Replace with the actual image path
    //   "text": "Standard Theme Template", // Name of the template
    //   "objects": [
    //     // Permit Indicia Text
    //     {
    //       "type": "textbox",
    //       "left": 414,
    //       "top": 0,
    //       "width": 66,
    //       "height": 60,
    //       "fontSize": 7,
    //       "fontFamily": "Myriad Pro",
    //       "text": "Presorted\nFirst Class Mail\nUS Postage\nPAID\nSD CA\nPermit #2722",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "lineHeight": 1.2
    //     },
    //     // Top Red Text Box
    //     {
    //       "type": "textbox",
    //       "left": -3,
    //       "top": -3,
    //       "width": 345,
    //       "height": 66,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "",
    //       "fill": "#D9002E",
    //       "padding": 4
    //     },
    //     // Address Text Box
    //     {
    //       "type": "textbox",
    //       "left": 136,
    //       "top": 162,
    //       "width": 344,
    //       "height": 197,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "[Address Line 1]\n[Address Line 2]",
    //       "fill": "#000000",
    //       "padding": 4
    //     },
    //     // Contact Info Text Box
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 57,
    //       "width": 168,
    //       "height": 23,
    //       "fontSize": 7,
    //       "fontFamily": "Your Font",
    //       "text": "[Your Name]\n[Your Phone Number]\n[Your Email Address]",
    //       "fill": "#808080",
    //       "textAlign": "left"
    //     },
    //     // Main Body Text
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 437,
    //       "width": 481,
    //       "height": 373,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "Dear [Name],\n\nI hope this finds you well and in good health.\nMy name is [Your Name], and I'm looking to buy your property at [Address].\n\nI'm willing to pay you CASH and avoid the costs of selling through a real estate agent.\n\n   *EASY to work with!\n   *CASH BUYER\n   *BUY AS-IS so no REPAIRS\n   *CLOSE on the date of YOUR choice\n\nPlease call [Your Phone Number] today!",
    //       "fill": "#000000",
    //       "padding": 4,
    //       "textAlign": "left"
    //     }
    //   ]
    // },
    // {
    //   "image": "../assets/img/blue circle.png", // Replace with the actual image path
    //   "text": "Standard Theme Template", // Name of the template
    //   "objects": [
    //     // Permit Indicia Text
    //     {
    //       "type": "textbox",
    //       "left": 414,
    //       "top": 0,
    //       "width": 66,
    //       "height": 60,
    //       "fontSize": 7,
    //       "fontFamily": "Myriad Pro",
    //       "text": "Presorted\nFirst Class Mail\nUS Postage\nPAID\nSD CA\nPermit #2722",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "lineHeight": 1.2
    //     },
    //     // Top Red Text Box
    //     {
    //       "type": "textbox",
    //       "left": -3,
    //       "top": -3,
    //       "width": 345,
    //       "height": 66,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "",
    //       "fill": "#D9002E",
    //       "padding": 4
    //     },
    //     // Address Text Box
    //     {
    //       "type": "textbox",
    //       "left": 136,
    //       "top": 162,
    //       "width": 344,
    //       "height": 197,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "[Address Line 1]\n[Address Line 2]",
    //       "fill": "#000000",
    //       "padding": 4
    //     },
    //     // Contact Info Text Box
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 57,
    //       "width": 168,
    //       "height": 23,
    //       "fontSize": 7,
    //       "fontFamily": "Your Font",
    //       "text": "[Your Name]\n[Your Phone Number]\n[Your Email Address]",
    //       "fill": "#808080",
    //       "textAlign": "left"
    //     },
    //     // Main Body Text
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 437,
    //       "width": 481,
    //       "height": 373,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "Dear [Name],\n\nI hope this finds you well and in good health.\nMy name is [Your Name], and I'm looking to buy your property at [Address].\n\nI'm willing to pay you CASH and avoid the costs of selling through a real estate agent.\n\n   *EASY to work with!\n   *CASH BUYER\n   *BUY AS-IS so no REPAIRS\n   *CLOSE on the date of YOUR choice\n\nPlease call [Your Phone Number] today!",
    //       "fill": "#000000",
    //       "padding": 4,
    //       "textAlign": "left"
    //     }
    //   ]
    // },
    // {
    //   "image": "../assets/img/Generic.JPG", // Replace with actual image path
    //   "text": "Street View Theme Template", // Name of the template
    //   "objects": [
    //     // Permit Indicia Text
    //     {
    //       "type": "textbox",
    //       "left": 408,
    //       "top": 0,
    //       "width": 72,
    //       "height": 60,
    //       "fontSize": 7,
    //       "fontFamily": "Myriad Pro",
    //       "text": "Presorted\nFirst Class Mail\nUS Postage\nPAID\nSD CA\nPermit #2722",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "lineHeight": 1.2
    //     },
    //     // Top Red Text Box
    //     {
    //       "type": "textbox",
    //       "left": -6,
    //       "top": -3,
    //       "width": 354,
    //       "height": 72,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "",
    //       "fill": "#D9002E",
    //       "padding": 4
    //     },
    //     // Address Text Box
    //     {
    //       "type": "textbox",
    //       "left": 114,
    //       "top": 177,
    //       "width": 368,
    //       "height": 160,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "[Address Line 1]\n[Address Line 2]",
    //       "fill": "#000000",
    //       "padding": 4
    //     },
    //     // Contact Info Text Box
    //     {
    //       "type": "textbox",
    //       "left": 1,
    //       "top": 53,
    //       "width": 139,
    //       "height": 19,
    //       "fontSize": 7,
    //       "fontFamily": "Your Font",
    //       "text": "[Your Name]\n[Your Phone Number]\n[Your Email Address]",
    //       "fill": "#808080",
    //       "textAlign": "left"
    //     },
    //     // Street View Image (Resized)
    //     {
    //       "type": "image",
    //       "left": 60,
    //       "top": 577,
    //       "width": 250, // Resized for better fit
    //       "height": 150, // Resized for better fit
    //       "src": "../assets/img/street_view_image.jpg" // Replace with actual image path
    //     },
    //     // Main Body Text
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 437,
    //       "width": 472,
    //       "height": 145,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "Dear [Name],\n\nMy name is [Your Name] and I want to buy your property at [Address].\n\nCall me at [Your Phone Number] AS-IS ALL CASH!",
    //       "fill": "#D9002E",
    //       "padding": 4,
    //       "textAlign": "left"
    //     }
    //   ]
    // },
    // {
    //   "image": "../assets/img/Notepad-NoLine Updated 2.png", // Replace with actual image path
    //   "text": "YLHQ Theme Template", // Name of the template
    //   "objects": [
    //     // Permit Indicia Text
    //     {
    //       "type": "textbox",
    //       "left": 410,
    //       "top": -1,
    //       "width": 70,
    //       "height": 52,
    //       "fontSize": 7,
    //       "fontFamily": "Myriad Pro",
    //       "text": "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "lineHeight": 1.2
    //     },
    //     // Return Address Box
    //     {
    //       "type": "textbox",
    //       "left": -4,
    //       "top": -4,
    //       "width": 349,
    //       "height": 91,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "[Return Address]",
    //       "fill": "#000000",
    //       "padding": 4
    //     },
    //     // Mailing Block
    //     {
    //       "type": "textbox",
    //       "left": 118,
    //       "top": 161,
    //       "width": 354,
    //       "height": 191,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "[Recipient Name]\n[Address Line 1]\n[Address Line 2]",
    //       "fill": "#000000",
    //       "padding": 4
    //     },
    //     // Houses Wanted Rotated Text
    //     {
    //       "type": "textbox",
    //       "left": -159,
    //       "top": 597,
    //       "width": 361,
    //       "height": 42,
    //       "fontSize": 23,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "HOUSES WANTED",
    //       "fill": "#D9002E",
    //       "textAlign": "center",
    //       "angle": -90
    //     },
    //     // Left Side Bar
    //     {
    //       "type": "rectangle",
    //       "left": 34,
    //       "top": 400,
    //       "width": 3,
    //       "height": 439,
    //       "fill": "#D9002E"
    //     },
    //     // Background Notepad Image
    //     {
    //       "type": "image",
    //       "left": -39,
    //       "top": 438,
    //       "width": 561,
    //       "height": 377,
    //       "src": "../assets/img/notepad_background.png" // Replace with actual image path
    //     },
    //     // Main Body Text
    //     {
    //       "type": "textbox",
    //       "left": 37,
    //       "top": 438,
    //       "width": 443,
    //       "height": 360,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "Dear [Name],\n\nMy name is [Your Name], and I own a property buying company. We are looking to\n$BUY$\nyour property at [Address].\n\nPlease call me at [Your Phone Number].",
    //       "fill": "#000000",
    //       "padding": 4,
    //       "textAlign": "left"
    //     },
    //     // Selling Points
    //     {
    //       "type": "textbox",
    //       "left": 37,
    //       "top": 650,
    //       "width": 443,
    //       "height": 150,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "* No Cost or Fees\n* Sell \"As-Is\"\n* Close in 30 days\n* No Realtors and No Hassles",
    //       "fill": "#000000",
    //       "textAlign": "left"
    //     },
    //     // P.S. I Pay Cash Text
    //     {
    //       "type": "textbox",
    //       "left": 39,
    //       "top": 590,
    //       "width": 168,
    //       "height": 31,
    //       "fontSize": 14,
    //       "fontFamily": "Lindy Med Blur",
    //       "text": "P.S. I pay cash!",
    //       "fill": "#000000",
    //       "textAlign": "left"
    //     }
    //   ]
    // },
    
    // {
    //   "image": "../assets/img/usps-template.jpg", // Replace with actual image path
    //   "text": "Sorry We Missed You Template", // Name of the template
    //   "objects": [
    //     // Permit Indicia Text
    //     {
    //       "type": "textbox",
    //       "left": 698,
    //       "top": 0,
    //       "width": 70,
    //       "height": 52,
    //       "fontSize": 7,
    //       "fontFamily": "Myriad Pro",
    //       "text": "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "lineHeight": 1.2
    //     },
    //     // Important Notice
    //     {
    //       "type": "textbox",
    //       "left": -210,
    //       "top": 196,
    //       "width": 481,
    //       "height": 87,
    //       "fontSize": 36,
    //       "fontFamily": "Arial Black",
    //       "text": "Important Notice",
    //       "fill": "#000DA6",
    //       "textAlign": "center",
    //       "angle": -90
    //     },
    //     // Sorry We Missed You Title
    //     {
    //       "type": "textbox",
    //       "left": 487,
    //       "top": 755,
    //       "width": 479,
    //       "height": 83,
    //       "fontSize": 34,
    //       "fontFamily": "Arial",
    //       "text": "Sorry We Missed You",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "angle": 90
    //     },
    //     // Background Orange Block
    //     {
    //       "type": "rectangle",
    //       "left": -45,
    //       "top": 516,
    //       "width": 856,
    //       "height": 565,
    //       "fill": "#FF732E",
    //       "borderRadius": 10
    //     },
    //     // Call Us Message
    //     {
    //       "type": "textbox",
    //       "left": -44,
    //       "top": 128,
    //       "width": 481,
    //       "height": 222,
    //       "fontSize": 14,
    //       "fontFamily": "Arial",
    //       "text": "Please Call Us Today: [Agent Number]\n\nWe are professional investors working in your neighborhood, buying houses for cash at competitive prices. We'll give you cash in exchange for your property. We can close quickly, don't charge commissions, and purchase as-is!",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "angle": -90
    //     },
    //     // Main Offer Section
    //     {
    //       "type": "textbox",
    //       "left": 141,
    //       "top": 567,
    //       "width": 479,
    //       "height": 461,
    //       "fontSize": 24,
    //       "fontFamily": "PremiumUltra26",
    //       "text": "We have been trying to contact you about your property at:\n\nWe can offer you [Offer Amount]\n\nFor your property.\n\nPLEASE CALL US!",
    //       "fill": "#000DA6",
    //       "textAlign": "center",
    //       "angle": 90
    //     },
    //     // Date Box
    //     {
    //       "type": "textbox",
    //       "left": 424,
    //       "top": 764,
    //       "width": 481,
    //       "height": 66,
    //       "fontSize": 24,
    //       "fontFamily": "PremiumUltra26",
    //       "text": "Date: [Mailing Date]",
    //       "fill": "#000DA6",
    //       "textAlign": "center",
    //       "angle": 90
    //     },
    //     // Reply By Box
    //     {
    //       "type": "textbox",
    //       "left": -206,
    //       "top": 764,
    //       "width": 488,
    //       "height": 66,
    //       "fontSize": 24,
    //       "fontFamily": "PremiumUltra26",
    //       "text": "Please reply by: [Reply Date]",
    //       "fill": "#000DA6",
    //       "textAlign": "center",
    //       "angle": 90
    //     },
    //     // Blue Underline Image
    //     {
    //       "type": "image",
    //       "left": 16,
    //       "top": 787,
    //       "width": 335,
    //       "height": 27,
    //       "angle": 90,
    //       "src": "../assets/img/blue_underline.png" // Replace with actual image path
    //     },
    //     // Barcode Image
    //     {
    //       "type": "image",
    //       "left": -14,
    //       "top": 757,
    //       "width": 292,
    //       "height": 91,
    //       "angle": -90,
    //       "src": "../assets/img/barcode.png" // Replace with actual image path
    //     },
    //     // Property Address
    //     {
    //       "type": "textbox",
    //       "left": 222,
    //       "top": 771,
    //       "width": 467,
    //       "height": 58,
    //       "fontSize": 30,
    //       "fontFamily": "PremiumUltra26",
    //       "text": "[Property Address]",
    //       "fill": "#000DA6",
    //       "textAlign": "center",
    //       "angle": 90
    //     },
    //     // Orange Side Panel
    //     {
    //       "type": "rectangle",
    //       "left": -39,
    //       "top": -40,
    //       "width": 329,
    //       "height": 564,
    //       "fill": "#FF732E"
    //     }
    //   ]
    // },
    // {
    //   "image": "../assets/img/SPRING - BACK (1).png", // Replace with actual image path
    //   "text": "Violet Property Inquiry Template", // Name of the template
    //   "objects": [
    //     // Permit Indicia Text
    //     {
    //       "type": "textbox",
    //       "left": 410,
    //       "top": 0,
    //       "width": 70,
    //       "height": 52,
    //       "fontSize": 7,
    //       "fontFamily": "Myriad Pro",
    //       "text": "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
    //       "fill": "#000000",
    //       "textAlign": "center",
    //       "lineHeight": 1.2
    //     },
    //     // Header Question
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 68,
    //       "width": 480,
    //       "height": 45,
    //       "fontSize": 20,
    //       "fontFamily": "ctorres",
    //       "text": "Is this property for sale?",
    //       "fill": "#6E0FFF",
    //       "textAlign": "center"
    //     },
    //     // Return Address Block
    //     {
    //       "type": "textbox",
    //       "left": -3,
    //       "top": -3,
    //       "width": 293,
    //       "height": 38,
    //       "fontSize": 10,
    //       "fontFamily": "ctorres",
    //       "text": "",
    //       "fill": "#000000",
    //       "textAlign": "left"
    //     },
    //     // Address Block
    //     {
    //       "type": "textbox",
    //       "left": 143,
    //       "top": 225,
    //       "width": 331,
    //       "height": 86,
    //       "fontSize": 14,
    //       "fontFamily": "ctorres",
    //       "text": "[Recipient Name]\n[Street Address]\n[City, State ZIP]",
    //       "fill": "#000000",
    //       "textAlign": "left"
    //     },
    //     // Sell Property Offer
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 439,
    //       "width": 480,
    //       "height": 360,
    //       "fontSize": 16,
    //       "fontFamily": "ctorres",
    //       "text": "Hi [Name],\n\nSell your property at [Property Address] now for CASH and skip the agent fees!\n\nCall or Text!",
    //       "fill": "#000000",
    //       "textAlign": "center"
    //     },
    //     // Contact Info
    //     {
    //       "type": "textbox",
    //       "left": 0,
    //       "top": 550,
    //       "width": 480,
    //       "height": 50,
    //       "fontSize": 18,
    //       "fontFamily": "ctorres",
    //       "text": "[Agent Name]\n[Agent Phone Number]",
    //       "fill": "#6E0FFF",
    //       "textAlign": "center"
    //     },
    //     // Front Background Image
    //     {
    //       "type": "image",
    //       "left": -38,
    //       "top": -40,
    //       "width": 419,
    //       "height": 329,
    //       "src": "../assets/img/spring_front.png" // Replace with actual image path
    //     },
    //     // Back Background Image
    //     {
    //       "type": "image",
    //       "left": -38,
    //       "top": 398,
    //       "width": 419,
    //       "height": 329,
    //       "src": "../assets/img/spring_back.png" // Replace with actual image path
    //     }
    //   ]
    // },
    {
      "image": "../assets/img/download.png", // Replace with actual image path
      "text": "Converted SVG Template", // Name of the template
      "objects": [
        {
          "type": "rectangle",
          "left": 0,
          "top": 0,
          "width": 550,
          "height": 367,
          "fill": "#008000" // Green background
        },
        {
          "type": "textbox",
          "left": 170,
          "top": 5.41,
          "width": 200,
          "height": 20,
          "fontSize": 14,
          "fontFamily": "Lindy Med Blur",
          "text": "",
          "fill": "#D9002E"
        },
        {
          "type": "textbox",
          "left": 241,
          "top": 564.69,
          "width": 480,
          "height": 220,
          "fontSize": 14,
          "fontFamily": "Lindy Med Blur",
          "text": "Dear [Name],\n\nI hope this finds you well and in good health.\nMy name is [Your Name], and I’m looking to buy your property at [Address].\nI’m willing to pay you CASH and avoid the costs of selling through a real estate agent.\n\n   *EASY to work with!\n   *CASH BUYER\n   *BUY AS-IS so no REPAIRS\n   *CLOSE on the date of YOUR choice\n\nPlease call [Your Phone Number] today!",
          "fill": "#000000",
          "textAlign": "left"
        },
        {
          "type": "textbox",
          "left": 135.25,
          "top": 53.14,
          "width": 200,
          "height": 50,
          "fontSize": 16,
          "fontFamily": "Georgia",
          "text": "45 Broadway \nChula Vista, CA 91910",
          "fill": "#FF5005",
          "textAlign": "center"
        },
        {
          "type": "textbox",
          "left": 76.03,
          "top": 83.32,
          "width": 100,
          "height": 20,
          "fontSize": 12,
          "fontFamily": "Arial",
          "text": "$(ID_numb)",
          "fill": "#030303"
        },
        {
          "type": "textbox",
          "left": 450.49,
          "top": 48.24,
          "width": 100,
          "height": 20,
          "fontSize": 10,
          "fontFamily": "Arial",
          "text": "FIRST CLASS",
          "fill": "#171717"
        },
        {
          "type": "textbox",
          "left": 433.77,
          "top": 75.2,
          "width": 120,
          "height": 20,
          "fontSize": 10,
          "fontFamily": "Arial",
          "text": "US POSTAGE PAID",
          "fill": "#171717"
        },
        {
          "type": "textbox",
          "left": 459.14,
          "top": 62.22,
          "width": 80,
          "height": 20,
          "fontSize": 10,
          "fontFamily": "Arial",
          "text": "PRESORT",
          "fill": "#171717"
        },
        {
          "type": "textbox",
          "left": 456.58,
          "top": 88.18,
          "width": 50,
          "height": 20,
          "fontSize": 10,
          "fontFamily": "Arial",
          "text": "YLHQ",
          "fill": "#171717"
        },
        {
          "type": "textbox",
          "left": 102.54,
          "top": 145.7,
          "width": 100,
          "height": 40,
          "fontSize": 24,
          "fontFamily": "Georgia",
          "text": "Call me\ntoday",
          "fill": "#3116BB",
          "textAlign": "center"
        },
        {
          "type": "image",
          "left": 96.87,
          "top": 145.41,
          "width": 450,
          "height": 300,
          "src": "../assets/img/sample1.png" // Replace with actual image path
        },
        {
          "type": "textbox",
          "left": 275.04,
          "top": 271.8,
          "width": 250,
          "height": 60,
          "fontSize": 20,
          "fontFamily": "Georgia",
          "text": "Krask Scott R\n405 Hunt River Way\nSuwanee, GA 30024-2745",
          "fill": "#DB6300",
          "textAlign": "center"
        },
        {
          "type": "image",
          "left": 331.4,
          "top": 210.02,
          "width": 943,
          "height": 357,
          "src": "../assets/img/sample2.png" // Replace with actual image path
        }
      ]
    }
    
    
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

  ngOnInit() {
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

  loadImageTemplate(template: any) {
    this.showProductData = false;

    const existingObjects = this.canvas.getCanvas().getObjects(); // Get existing objects

    // Preserve the background image if it exists
    const backgroundImage = this.canvas.getCanvas().backgroundImage;

    this.canvas.getCanvas().clear(); // Clear canvas but NOT the background

    if (backgroundImage) {
      this.canvas
        .getCanvas()
        .setBackgroundImage(
          backgroundImage,
          this.canvas.getCanvas().renderAll.bind(this.canvas.getCanvas())
        );
    }

    // Load the template design image
    if (template.image) {
      fabric.Image.fromURL(template.image, (img) => {
        const canvasWidth = this.canvas.getCanvas().getWidth();
        const canvasHeight = this.canvas.getCanvas().getHeight();

        img.set({
          left: canvasWidth / 2 - img.width / 2, // Center horizontally
          top: canvasHeight / 2 - img.height / 2, // Center vertically
          scaleX: 1, // Keep original scale
          scaleY: 1,
          selectable: true, // Make it resizable
          evented: true,
          hasControls: true, // Enable resize handles
          hasBorders: true,
        });

        this.canvas.getCanvas().add(img);
        this.canvas.getCanvas().setActiveObject(img); // Select the image
        this.canvas.getCanvas().renderAll();
      });
    }

    // Load new template text objects
    template.objects.forEach((objData) => {
      let newObject;

      if (objData.type === "textbox") {
        newObject = new fabric.Textbox(objData.text, {
          left: objData.left,
          top: objData.top,
          fontFamily: objData.fontFamily,
          fontSize: objData.fontSize,
          fill: objData.fill,
          width: objData.width,
        });
      }

      // Add the new object to the canvas
      if (newObject) {
        this.canvas.getCanvas().add(newObject);
      }
    });

    // Re-add the existing objects to the canvas
    existingObjects.forEach((obj) => {
      this.canvas.getCanvas().add(obj);
    });

    this.canvas.getCanvas().renderAll(); // Render everything
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

  toggleShowTopBarModal() {
    this.showTopBarModal = !this.showTopBarModal;
  }

  toggleProductData() {
    this.showProductData = false;
  }

  public changeSizeWithMeasures(height: number, width: number) {
    // Clear the canvas before applying new size
    this.canvas.getCanvas().clear();
    this.frontCanvasData = null;
    this.backCanvasData = null;
    // Call the existing changeSizeWithMeasures function in fabric.ts
    this.canvas.changeSizeWithMeasures(height, width);
    this.addDashedSafetyArea();

    console.log(`Canvas size changed to ${width}x${height}`);
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
      if (object instanceof fabric.Textbox || object instanceof fabric.Text) {
        object.set("fill", selectedColor);
      }
    });

    this.canvas.getCanvas().renderAll();
  }
  getBleedAreaLines(): fabric.Object[] {
    return this.canvas.getCanvas().getObjects().filter((obj: any) => obj._id === "bleed-line");
  }
  
  
}
