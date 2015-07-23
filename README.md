# Material Design Color Generator
A tool for generating a color palette for Material Design.
###<a href="http://mcg.mbitson.com/">Click here to view the tool!</a>

# What's New?
* Export your color choices to the AngularJS Material Design theme declaration code.
* Modify any one palette color.
* The newest release includes support for colourlovers.com palettes. You may now select a top palette and instantly have a material design theme!
* Improved Performance with more than 2 palettes.

# Planned Future Enhancements
* Design new custom UI with following enhancements in mind:
* Change pre tag in code views to code editor with syntax highlighting.
* Add copy-to-clipboard button to code editor.
* Change color logic to preserve saturation/brightness and only adjust hue. (TinyColor.js)
* Improve performance by dynamically creating and destroying the color picker button and UI instead of loading a ton of Divs into the DOM for each color on the screen and hiding them.
* Allow less than one palette by dynamically adjusting the code generated.
* Allow for nameless (generic named) palettes to set a default MD theme.
* Add reset buttons for each individual color in a palette (based on main palette color)
* Create UI for more than 5 palettes (and/or alert user about dangers of using this many palettes)
* Import palette from angularjs material design theme declaration code
* Import palette from list of hex values
* Import palette from list of RGB colors
* Remove individual color's hex details and create tooltip styled with all color details. (Hoverintent, populated only once it's opening, includes hex, rgb, cmyk, saturation, brightness. Possibly obtained using tinycolor)