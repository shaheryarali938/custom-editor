import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FabricjsEditorComponent } from "projects/angular-editor-fabric-js/src/public-api";
import { fabric } from "fabric";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
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
    {
      image: "../assets/img/283w-gp7mtx-pwXA.webp",
      text: "Bird Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 200,
          fontSize: 20,
          fontFamily: "Arial",
          text: "Add text for Tea Party Template!",
          fill: "#000000",
        },
      ],
    },
    {
      image: "../assets/img/400w-elzoGX-60GY.webp",
      text: "Branch Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 200,
          fontSize: 20,
          fontFamily: "Arial",
          text: "This is a Birthday Template!",
          fill: "#000000",
        },
      ],
    },
    {
      image: "../assets/img/1600w-yK5aaGtg5ag.webp",
      text: "Merry Christmas Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: "Arial",
          text: "Merry Christmas!",
          fill: "#FF0000",
        },
      ],
    },
    {
      image: "../assets/img/1131w-XNBaqNbEN0g.webp",
      text: "Hello Christmas Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: "Arial",
          text: "Hello Christmas!",
          fill: "#FF5733",
        },
      ],
    },
    {
      image: "../assets/img/400w-jwGZdB976qs.webp",
      text: "Green & Purple Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: "Arial",
          text: "Green & Purple!",
          fill: "#28a745",
        },
      ],
    },
    {
      image: "../assets/img/283w-IMWozLAU4-Q.webp",
      text: "Green & Purple Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: "Arial",
          text: "Green & Purple!",
          fill: "#28a745",
        },
      ],
    },
    {
      image: "../assets/img/283w-ZtJkm9u4ocI.webp",
      text: "Green & Purple Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: "Arial",
          text: "Green & Purple!",
          fill: "#28a745",
        },
      ],
    },
    {
      image: "../assets/img/283w-j7P7DHcqJxU.webp",
      text: "Travel Visit Template",
      objects: [
        {
          type: "textbox",
          left: 150,
          top: 20,
          width: 300,
          fontSize: 30,
          fontFamily: "Arial",
          text: "Travel & Visit!",
          fill: "#007bff",
        },
      ],
    },
    {
      image: "../assets/img/NewDoodles - Arrow (Blue)_page-0001.jpg",
      text: "Real Estate Template", // Name of the template
      objects: [
        // Permit Indicia Text
        {
          type: "textbox",
          left: 410,
          top: 0,
          width: 70,
          height: 52,
          fontSize: 7,
          fontFamily: "Myriad Pro",
          text: "FIRST CLASS\nPRESORT\nUS POSTAGE PAID\nYLHQ",
          fill: "#000000",
          textAlign: "center",
          lineHeight: 1.2,
        },
        // Red Text Box
        {
          type: "textbox",
          left: -4,
          top: -1,
          width: 252,
          height: 46,
          fontSize: 10,
          fontFamily: "Your Font",
          text: "I can pay you cash for your house, so please, contact me ASAP if you'd like to sell.",
          fill: "#D9002E",
          padding: 4,
        },
        // Image 1
        {
          type: "image",
          left: 245,
          top: 52,
          width: 166,
          height: 79,
          src: "../assets/img/candy-stick.png", // Replace with the actual image path
        },
        // Image 2
        {
          type: "image",
          left: 375,
          top: 458,
          width: 110,
          height: 52,
          src: "../assets/img/candy-stick.png", // Replace with the actual image path
        },
        // Flip Over Text
        {
          type: "textbox",
          left: 118,
          top: 122,
          width: 362,
          height: 35,
          fontSize: 10,
          fontFamily: "Your Font",
          text: "Flip over for something very important!",
          fill: "#D9002E",
        },
        // Image 3
        {
          type: "image",
          left: 278,
          top: 127,
          width: 202,
          height: 38,
          src: "../assets/img/NewDoodles - Arrow (Blue)_page-0001.jpg", // Replace with the actual image path
        },
        // Main Text Box
        {
          type: "textbox",
          left: 0,
          top: 467,
          width: 472,
          height: 351,
          fontSize: 10,
          fontFamily: "Your Font",
          text: "Hi [Name],\nMy name is [Your Name] and\nI want to buy your house at\n[Address]\nI can pay you CASH no matter\nwhat the condition is of the home.\nCall me now to receive a Fair Cash Offer!\n\n[Phone Number]\n\nP.S. No Realtor Fees, No Appraisals,\nNo Repairs, No Hassles!\nCall Me Right Away!",
          fill: "#D9002E",
          textAlign: "center",
          padding: 4,
        },
        // Address Text Box
        {
          type: "textbox",
          left: 134,
          top: 186,
          width: 337,
          height: 30,
          fontSize: 13,
          fontFamily: "Ctorres",
          text: "[Address Line 1]\n[Address Line 2]",
          fill: "#000000",
          padding: 4,
        },
        // Image 4
        {
          type: "image",
          left: 0,
          top: 76,
          width: 100,
          height: 97,
          src: "../assets/img/NewDoodles - Arrow (Blue)_page-0001.jpg", // Replace with the actual image path
        },
        // Contact Info Text Box
        {
          type: "textbox",
          left: 134,
          top: 223,
          width: 307,
          height: 67,
          fontSize: 10,
          fontFamily: "Your Font",
          text: "[Your Name]\n[Your Phone Number]\n[Your Email Address]",
          fill: "#D9002E",
          padding: 4,
        },
      ],
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
}
