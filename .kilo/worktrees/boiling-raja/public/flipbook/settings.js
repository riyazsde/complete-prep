var option_my_flipbook = {
  openPage: 1,
  //change number to open directly on a specific internal page

  zoomRatio: 2,
  //change zoom intensity

  is3D: true,
  //change to false to deactivate the 3d effect

  has3DShadow: true,
  //change to false to remove the shadow effect

  height: "80vh",
  //use a specific value like 600px to set a fixed height

  paddingTop: 40,
  paddingLeft: 45,
  paddingRight: 45,
  paddingBottom: 40,
  //padddings of the flipbook pages in pixels

  backgroundColor: "#dfdfdf",
  //you can use a specific color like #ffffff (white)

  backgroundImage: "assets/bg.jpg",
  //path to the background image. You can leave blank to and define a color on the variable above

  flexibility: 0.9,
  //this variable define the flexibility of the pages
  //If you increase the value the curv that the page form on flip will be bigger

  duration: 800,
  //durration of the page flip in miliseconds

  autoPlay: true,
  //change to false to remove the autoplay option from the menu

  autoPlayDuration: 2000,
  //time frame in milliseconds in-between page changes for autoplay

  autoPlayStart: false,
  //change to true to start the autoplay function on load

  direction: TPDFFLIP.DIRECTION.LTR,
  //change to RTL to reverse the interce the flipping (for arabic or hebrew for example)

  enableSound: true,
  //change to false to mute the flip sound by default

  showSearchControl: true,
  //change to false to hide search icon on the menu

  showPrintControl: true,
  //change to false to hide print icon on the menu

  enableDownload: true,
  //change to false to hide download icon on the menu

  autoOpenOutline: false,
  //change to true to display the table of contents by default

  autoOpenThumbnail: false,
  //change to true to display the thumbnails of the pages by default

  overwritePDFOutline: false,
  //change to true overwrite the table of contents of your pdf file with the one you create manually

  controlsFloating: false,
  //change to true to reduce the width of the icons menu and center it

  controlsPosition: TPDFFLIP.CONTROLSPOSITION.BOTTOM,
  //change from BOTTOM to TOP to move the icons menu on the top part of the screen

  allControls:
    "more,play,thumbnail,altPrev,zoomIn,zoomOut,startPage,pageNumber, endPage,altNext,fullScreen,download,print,sound,play",
  // icons - share,search
  //list with all the icons/functions from the menu

  moreControls: "startPage,endPage,play,thumbnail,print",
  //list with the icons/fuctions that will hide under the more menu

  hideControls: "share,search,outline,print,download",
  //you can add here the icons/functions that you need to hide. For example "share,download" to hide those two icons

  hideShareControls: "",
  //you can use to hide a specific share icon (you can add "facebook, google" for example to hide those option on the share screen
  //these are the value for the share icons facebook, google, twitter,  whatsapp, linkedin, pinterest, mail

  flipbookFitPages: false,
  //if your pdf file contain pages with diffrent size/aspect ratio this variable will force all pages to the size and aspect ratio of the cover

  pageMode: TPDFFLIP.PAGE_MODE.AUTO,
  //the AUTO value will display double pages on big screens and single pages on small screens (phones)
  //change AUTO to SINGLE to display a single page at a time on all devices
  //change AUTO to DOUBLE to display a spread (two pages) on all devices

  singlePageMode: TPDFFLIP.SINGLE_PAGE_MODE.AUTO,
  //change AUTO to BOOKLET to display a single page at a time in the center of the screen

  pageSize: TPDFFLIP.FLIPBOOK_PAGE_SIZE.AUTO,
  //change AUTO to DOUBLE_INTERNAL if your PDF have the internal page merged/combined and you want to display as two pages

  hasSpiral: false,
  //change to true to add a spiral binder 3d effect

  flipbook3DTiltAngleUp: 0,
  //tilt flipbook in perspective. Use 10 for example to tilt it 10deg

  flipbook3DTiltAngleLeft: 0,
  //tilt flipbook to the left. Use 10 for example to tilt it 10deg to the left. Use -10 to tilt it 10 deg to the right

  scrollWheel: true,
  //activate scroll wheel on mouse

  mouseScrollAction: TPDFFLIP.MOUSE_SCROLL_ACTIONS.ZOOM,
  //use mouse scroll wheel to zoom in on pages

  flipbookHardPages: "cover",
  //change "none" to "cover" to get a 3D hard cover effect
  //change "none" to "all" to get a 3D hard page effect to all pages

  cover3DType: TPDFFLIP.FLIPBOOK_COVER_TYPE.NONE,
  //change none to PLAIN to optain a book hard cover bezel effect
  //change none to BASIC to optain a book hard cover bezel effect with shadows
  //change none to RIDGE to optain a book hard cover bezel effect with ridge and shadows

  color3DCover: "#efc131",
  //inner color value for hard cover

  logo: "assets/images/logo-light.png",
  //add a logo to the bottom right of the menu
  //leave blank to remove it

  logoUrl: "https://www.ppf-flip.com/",
  //add URL to the logo
};






