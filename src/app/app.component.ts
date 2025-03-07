import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FabricjsEditorComponent } from "projects/angular-editor-fabric-js/src/public-api";
import { fabric } from "fabric";

declare var FontFace: any;


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

        // Step 1: Store Bleed Area Before Clearing Canvas
        const bleedLines = this.getBleedAreaLines(); // Get existing bleed area

        fabricCanvas.clear(); // Clear previous objects before loading new one

        // Load SVG and ensure text is editable
        fabric.loadSVGFromString(svgString, (objects, options) => {
          const editableObjects: fabric.Object[] = [];

          objects.forEach((obj) => {
            // Check if the object is text-based
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
              // Make non-text objects selectable and editable
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

          // Step 2: Add Elements to Canvas
          editableObjects.forEach((obj) => fabricCanvas.add(obj));

          // Step 3: Restore Bleed Area Lines
          bleedLines.forEach((line) => fabricCanvas.add(line));

          fabricCanvas.renderAll();
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
    {
      name: "Blessed Postcard 4.25 (Front)",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/blessed.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/blessed_postcard_4.25x5.5_front.json",
    },
    {
      name: "Blessed Postcard 4.25 (Back)",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/blessed-back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/blessed_postcard_4.25x5.5_back (2).json"
    },
    {
      name: "Doodle Street View (Front)",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/doodle_street_view.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/doole_street_view_front.json",
      
    },
    {
      name: "Doodle Street View (Back)",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/doodle_street_view_back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/doole_street_view_back.json"
    },
    {
      name: "Flower Postcard (Front)",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/flower_postcard_front.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/flower_postcard_front.json",
      
    },
    {
      name: "Flower Postcard (Back)",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/flower_postcard_back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/flower_postcard_back.json"
    },
    {
      name: "Realistic Postcard (Back)",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/rp_back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/rp_back_4.25.json"
    },
    {
      name: "Realistic Postcard (Front)",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/rp.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/rp_front_4.25.json"
    },
    {
      name: "Street View Postcard (Back)",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/svp_back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/svp_back_4.25.json"
    },
    {
      name: "Street View Postcard (Front)",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/svp.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/svp_front_4.25.json"
    },
    {
      name: "Violet Postcard (Back)",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/vp_back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/vp_back_4.25.json"
    },
    {
      name: "Violet Postcard (Front)",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/vp_back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/vp_front_4.25.json"
    },
    {
      name: "Yellow Letter Postcard (Back)",
      size: "4.25x5.5",
      side: "back",
      image: "../assets/img/ylp_back.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/ylp_back_4.25.json"
    },
    {
      name: "Yellow Letter Postcard (Front)",
      size: "4.25x5.5",
      side: "front",
      image: "../assets/img/ylp.png",
      filePathFront: "../assets/prebuilt-templates/4.25×5.5/ylp_front_4.25.json"
    },




    {
      name: "Casita Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/casita_postcard_front.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/casita_postcard_front.json",
      // filePathBack: "../assets/prebuilt-templates/4.25×5.5/blessed_postcard_4.25x5.5_back.json"
    },
    {
      name: "Casita Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/casita_postcard_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/casita_postcard_back.json"
    },
    {
      name: "Doodle Street View (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/doodle_street_view.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/doole_street_view_front_8.5.json",
      
    },
    {
      name: "Doodle Street View (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/doodle_street_view_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/doole_street_view_back_8.5.json"
    },
    {
      name: "Flower Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/flower_postcard_front.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/flower_postcard_front_8.5.json",
      
    },
    {
      name: "Flower Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/flower_postcard_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/flower_postcard_back_8.5.json"
    },
    {
      name: "Realistic Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/rp_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/rp_back_8.5.json"
    },
    {
      name: "Realistic Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/rp.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/rp_front_8.5.json"
    },
    {
      name: "Standard Handwritten Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/shp_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/shp_back_8.5.json"
    },
    {
      name: "Standard Handwritten Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/shp.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/shp_front_8.5.json"
    },
    {
      name: "Street View Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/svp_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/svp_back_8.5.json"
    },
    {
      name: "Street View Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/svp.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/svp_front_8.5.json"
    },
    {
      name: "Sorry We Missed You Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/swmy_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/swmy_back_8.5.json"
    },
    {
      name: "Sorry We Missed You Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/swmy.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/swmy_front_8.5.json"
    },
    {
      name: "Violet Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/vp_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/vp_back_8.5.json"
    },
    {
      name: "Violet Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/vp.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/vp_front_8.5.json"
    },
    {
      name: "Yellow Letter Postcard (Back)",
      size: "8.5x5.5",
      side: "back",
      image: "../assets/img/ylp_back.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/ylp_back_8.5.json"
    },
    {
      name: "Yellow Letter Postcard (Front)",
      size: "8.5x5.5",
      side: "front",
      image: "../assets/img/ylp.png",
      filePathFront: "../assets/prebuilt-templates/8.5×5.5/ylp_front_8.5.json"
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
  fontsLoaded = false;


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

// In your component class:
public selectedSize: string | null = null;

public changeSizeWithMeasures(height: number, width: number, sizeLabel: string) {
  // 1) Clear canvas
  // this.canvas.getCanvas().clear();
  // this.frontCanvasData = null;
  // this.backCanvasData = null;

  // 2) Change size of the Fabric.js canvas
  this.canvas.changeSizeWithMeasures(height, width);
  this.addDashedSafetyArea();

  // 3) Record which size has been selected
  this.selectedSize = sizeLabel;

  console.log(`Canvas size changed to ${width}x${height}, selectedSize = ${sizeLabel}`);
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
