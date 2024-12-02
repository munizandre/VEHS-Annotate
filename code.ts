figma.showUI(__html__);

figma.ui.resize(500,360);

// loading fonts used in the plugin
figma.loadFontAsync( {family: "Inter", style: "Regular"});
figma.loadFontAsync( {family: "Inter", style: "Bold"});

// creates the callout elements
function createCallout (index: string, x: number = 0, y: number = 0): FrameNode {
    
    // creating the elements for both callout and reference table
    const frame = figma.createFrame();
    const callout = figma.createText();

    frame.appendChild(callout);

    // formatting the callout frame
    frame.resize(30,30);
    frame.fills = [figma.util.solidPaint("#00AFD7")];
    frame.x = x-15;
    frame.y = y-15;
    frame.layoutMode = "VERTICAL";
    frame.layoutSizingVertical = "FIXED";
    frame.primaryAxisAlignItems = "CENTER";
    frame.counterAxisAlignItems = "CENTER";
    frame.cornerRadius = 15;
    frame.name = "# " + index;

    // formatting the callout
    callout.characters = index;
    callout.textAlignHorizontal = "CENTER";
    callout.textAlignVertical = "CENTER";
    callout.fills = [figma.util.solidPaint("FFFFFF")];

    return frame;
}

// creates the reference text (title and description)
function createReference (titlemsg : string, descmsg : string) : FrameNode {

    const reference = figma.createFrame();
    const title = figma.createText();
    const description = figma.createText();
        
    // creating the reference frame
    reference.resize(300, 200); // setting base size
    reference.layoutMode = "VERTICAL"; // applying auto-layout (vertical)
    reference.layoutSizingVertical = "HUG"; // hugging vertically
    reference.layoutSizingHorizontal = "FIXED"; // setting fixed width
    reference.primaryAxisAlignItems = "MIN"; // docking vertically at the beginning
    reference.counterAxisAlignItems = "MIN"; // docking horizontally at the begining
    reference.itemSpacing = 16;
    reference.name = "Reference";
        
    // creating the reference title
    reference.appendChild(title);
    title.characters = titlemsg;
    title.fills = [figma.util.solidPaint("000000")];
    title.fontName = { family: "Inter", style: "Bold" };
    title.fontSize = 16;
    title.name = "Annotation Title";

    // creating the reference description (if any)
    if (descmsg != "") {
        reference.appendChild(description);
        description.characters = descmsg;
        description.name = "Annotation Description";
        description.fills = [figma.util.solidPaint("000000")];
        description.textAutoResize = "HEIGHT"; // setting text box adjusts to fit the characters
        description.layoutSizingHorizontal = "FILL"; // setting the width to fill parent's container
        description.layoutSizingVertical = "HUG"; // setting the height to hugh text content
    }
    
   return reference;
}

// creates the annotation legend
function createAnnotation (x : number = 0, y : number = 0) : FrameNode {

    const annotation = figma.createFrame();
    
    // creating the reference
    annotation.name = "Annotations";
    annotation.fills = [figma.util.solidPaint("#FFFFFF")];
    annotation.layoutMode = "HORIZONTAL";
    annotation.layoutSizingVertical = "HUG";
    annotation.primaryAxisAlignItems = "MIN";
    annotation.counterAxisAlignItems = "MIN";
    annotation.paddingBottom = annotation.paddingLeft = annotation.paddingRight = annotation.paddingTop = 20;
    annotation.itemSpacing = 20;
    annotation.name = "Annotation";

    annotation.x = x+100;
    annotation.y = y-15;

    return annotation;
}

// main function
figma.ui.onmessage = pluginMessage => {

    if (pluginMessage == "closePlugin") {

        figma.closePlugin();

    } for (let node of figma.currentPage.selection) {
        let callout = createCallout(pluginMessage.index, node.x + node.width, node.y); // creates the callout on each element's corner
    }

    let selection = figma.currentPage.selection[0]; // taking the 1st element in the selection

    let annotation = createAnnotation(selection.x + selection.width, selection.y);
    let callout = createCallout(pluginMessage.index);
    let reference = createReference(pluginMessage.title, pluginMessage.description);

    annotation.appendChild(callout);
    annotation.appendChild(reference);
}