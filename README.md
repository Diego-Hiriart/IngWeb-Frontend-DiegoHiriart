# Web Engineering Core Project: Front-end
This is the front-end for my Web Engineering course's main project. I used React to create this app, mostly because it is a very popular and pretty powerful library from what I had heard so far when I chose it. Using React ended up being quite a challenge but it is still a good JS library, however, in the future I would not mind exploring other options for front-end. Most of the challenge in using React came from the fact that JavaScript was almost completely new for me, so the learning curve was difficult since I had to learn JS basics and React's characteristics simultaneously. Although the web site ended up working like I wanted it to, it is very simple aesthetically and I might not have used React to its full potential, the overall look of the site and best practices for React are improvements that could be applied for the future. 

# Installing and running the React app locally
First of all, make sure you have installed Node in your computer, this will allow you to run the commands you need. Then, once you have downloaded the code, open the folder in Visual Studio Code and open a terminal, run this command in it:
```
npm install
```
That will install all the necessary dependencies (packages) needed for the React app. When the installation has completed, you can run the app with:
```
npm start
```
With that command, you will start up a development server, which will not only locally start the app in the designated port but will also reload the app whenever you save changes without needing to restart the server.\
Remember, this React app uses the API developed as a back end for this project, so you will also need to install and run that. You can find the repo here: [Web Engineering Core Project: Back-end](https://github.com/Diego-Hiriart/IngWeb-Backend-DiegoHiriart).

# Deployed web site
This React app has been deployed to Heroku, you can use it like a web site here:
  - https://ingweb-front-hiriart.herokuapp.com/

To use this web site, you should log in with the following credentials:
  - User/email: _PublicTesting_ or _public@testing.com_
  - Password: testme123_

# Using the web site
Regardless of whether you are using it locally or online, these are the general steps/guidelines you should follow to use it:
  - Everything needs you to be logged in, except for _Creating a new user_, _Search for a model_, and _Advanced search_.
  - The _Administration Menu_, _Get all users_, and _Admin control for users_ need an admin role to be accessed. If you are using it locally, you can create a user with and admin role so that you can access these features, which are especially useful to manage brands, models, and components.
  - To log in, use the _Account_ option in the nav bar.
  - If you want to edit your username, email, or password, head to _Edit user_ once you have logged in.
  - To manage posts, that is creating, editing or deleting them, use the _Brands & Models_ option. 
    - Creating a post is pretty self-explanatory, you choose a model, select the date you purchased it and write a review. You can leave the _Date first issues appeared_ and _Date product became innoperative_ fields blank if they do not apply.
    - In the _Manage your posts_ options, you will see a list of all your posts, clicking the edit button will open a new tab where you can edit the post, delete it, or add issues. In the same menu you can manage issues in a similar way you manage a post, you can add, edit, and delete them.
  - In the _Search for a model_ option, you just have to choose a brand and model from it. Once you choose the model, you will see:
    - Information about the model.
    - The number of reviews, average life span and average time the model lasts without issues.
    - A list of issues for the model, ordered by component. This list indicates the percentage of reviews (shown above) that have issues in this component, and the percentage of those issues that could be fixed successfully.
  - The _Advanced search_ option allows you to find models that adjust to your expectations. You will get a list of models, the number of reviews they have, their life span, and the time they lasted without issues. The following filters must be applied:
    - The minimum number of reviews that model must have.
    - The minimum average amount of time (in years) that must have passed for the model to become inoperative.
    - The minimum amount of time (in years) that, in average, the model must have functioned without any issues.
    - The maximum percentage of reviews for the model that have issues, this applies for any component.
    - The minimum percentage of issues that can be fixed, this filter applies for any model and the percentage considers all issues that have been posted.

# Core functionality of the project
This project essentially consists of a web site to post reviews of tech products in general. The purpose of this project is to offer a repository that users can go to when they need to research a product's potential issues and how long it will last. A site like this would be especially useful when looking to buy a new tech product, since ideally you want something that lasts and isn't difficult to maintain. Because of this, the web site is not limited to plain text or score-based reviews and allows users to add the product's life span and issues when making a review. The information posted by users when reviewing can then be used by others to look up which products are best suited for their needs.

As mentioned, users will be able to post reviews with details regarding the life span their specific instance of the product had, how long it lasted without presenting issues, and the issues themselves (these are problems with the product, e.g., a faulty RAM stick). These posts feed the repository for the web site and are the main source of information for people doing research about a specific model or looking for products that match ceratin filters. When users are researching products, they can either view durability and issue data for a specific model, or search for models that meet criteria for life span, time without issues, number of reviews, percentage of issues with reviews, and percentage of those issues that can be fixed.

To ensure that there aren´t several copies of the same product, brand, or component, users can only choose from a list of these, which have been previously defined (and must be kept updated) by the administrators. Mainly, this avoids situations in which products are called differently by different people, but from a model number perspective they are the same. The administrators' role doesn't extend much further than this, they can use the platform like a regular user besides these and user management (deletion and admin privileges) functionalities.

# Contact
[hiriart.leon.d@gmail.com](mailto:hiriart.leon.d@gmail.com)

<br>
<br>
<br>
<br>

# The following is just the readme created by React, it has some useful information

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
