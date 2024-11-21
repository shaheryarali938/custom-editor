import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Text',
    path: '/',
    icon: <AiIcons.AiFillFileText />,
    cName: 'nav-text'
  },
  {
    title: 'Rectangle',
    path: '/',
    icon: <IoIcons.IoMdSquare />,
    cName: 'nav-text'
  },
  {
    title: 'Circle',
    path: '/',
    icon: <FaIcons.FaCircle />,
    cName: 'nav-text'
  },
  {
    title: 'Downlaod image',
    path: '/',
    icon: <IoIcons.IoMdDownload />,
    cName: 'nav-text'
  }
];
