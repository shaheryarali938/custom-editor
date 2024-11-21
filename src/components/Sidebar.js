import React, { useState, useRef } from 'react';
import { Stage, Layer, Text, Rect, Circle } from 'react-konva';
import "../App.css"
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';


function Sidebar() {
  const [elements, setElements] = useState([]);
  const stageRef = useRef();

  // Add text or shape
  const addText = () => {
    setElements([
      ...elements,
      { type: 'text', id: Date.now(), x: 100, y: 100, text: 'Edit Me', fontSize: 24, draggable: true },
    ]);
  };
  
  const addShape = (shape) => {
    const newShape = shape === 'rect'
      ? { type: 'rect', id: Date.now(), x: 50, y: 50, width: 100, height: 100, fill: 'blue', draggable: true }
      : { type: 'circle', id: Date.now(), x: 150, y: 150, radius: 50, fill: 'red', draggable: true };
    setElements([...elements, newShape]);
  };
  
  // Export canvas as image
  const exportAsImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'design.png';
    link.href = uri;
    link.click();
  };

  return (
    <div>
      <div className="Sidebar">
      <ul className="SidebarList">
        <li className="row"
            onClick={addText}>
          <div id="icon">{<AiIcons.AiFillFileText />}</div> <div id="title">Text</div>
        </li>
        <li className="row"
            onClick={() => addShape('rect')}>
          <div id="icon">{<IoIcons.IoMdSquare />}</div> <div id="title">Rectangle</div>
        </li>
        <li className="row"
            onClick={() => addShape('circle')}>
          <div id="icon">{<FaIcons.FaCircle />}</div> <div id="title">Circle</div>
        </li>
        <li className="row"
            onClick={exportAsImage}>
          <div id="icon">{<IoIcons.IoMdDownload  />}</div> <div id="title">Downlaod image</div>
        </li>
      </ul>
      </div>
      <div className='Stage'>
        <Stage width={1500} height={500} style={{ border: '1px solid black', alignItems: "right", marginTop:"-225px", marginLeft:"250px"}} ref={stageRef}>
          <Layer>
            {elements.map((el) => {
              if (el.type === 'text') {
                return (
                  <Text
                    key={el.id}
                    {...el}
                    onDblClick={() => console.log('Text selected')}
                  />
                );
              } else if (el.type === 'rect') {
                return (
                  <Rect key={el.id} {...el} />
                );
              } else if (el.type === 'circle') {
                return (
                  <Circle key={el.id} {...el} />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
      
    </div>
  );
}

export default Sidebar