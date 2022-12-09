# Design Token Converter 💻
This program is a command-line tool for converting design tokens from a JSON file into CSS variables. It allows designers and developers to use design tokens in their front-end code, ensuring consistency and making it easier to update the design system.
<br>

## Installation 📥
To use this program, you will need to have Node.js installed on your computer. Once you have Node.js installed, you can install the program by cloning this repository and running npm install to install the necessary dependencies.
<br>

## Usage 🚀
To use the program, open a terminal or command prompt and navigate to the directory where you installed the program. Then, run the following command, replacing <json file path> and <output css file path> with the paths to the JSON file containing your design tokens and the CSS file you want to create, respectively:

```bash
node convert.js <json file path> <output css file path> <prefix>[default is "token"]
# For example, if your JSON file is located at C:\design-tokens.json and you want 
# to create a CSS file at C:\css\tokens.css, you would run the following command:
```
  
```bash
node convert.js C:\design-tokens.json C:\css\tokens.css
# You can also specify a prefix for your CSS variables by adding it as an additional argument. 
# For example, if you want to use the prefix my-project, you would run the following command:
```
  
```bash
node convert.js C:\design-tokens.json C:\css\tokens.css my-project
# The program will then convert the design tokens in the JSON file and output 
# the resulting CSS variables to the specified CSS file.
```
  
Output example of `node converter tokens.json main.css belo`

![image](https://user-images.githubusercontent.com/114623565/206787287-e352d53d-84d0-4f76-af14-afde816f4b3c.png)


<br>
  
## Contributing 🤝
We welcome contributions to this project! If you encounter any bugs or have ideas for new features, please open an issue to let us know. You can also submit a pull request with your proposed changes.
<br>
  
## License 📜
This program is licensed under the MIT License. See the [LICENSE](https://github.com/GFY-Holding/converter/blob/main/LICENSE) file for more information.
