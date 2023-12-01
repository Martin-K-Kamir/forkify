
#### Overview of Forkify Application
Forkify is a comprehensive recipe search application that provides the functionality to not only search for various
recipes but also to save your favorite ones. Additionally, it offers the ability to add and delete your own recipes.

#### Journey and Refactoring of Forkify Application
This application is a refactored version of the original Forkify app from the Udemy course titled [The Complete
JavaScript Course: From Zero to Expert!](https://www.udemy.com/course/the-complete-javascript-course/) by [Jonas Schmedtmann](https://twitter.com/jonasschmedtman). This course was one of my initial steps into the world of
web development. The refactoring process served as a testament to the knowledge and skills I have acquired since then.

Initially, the application was constructed using ES6 classes and modules, following the MVC architecture, and styled
with Sass. However, I decided to transition to React for the User Interface and Redux Toolkit for state management.
Communication with the API is handled using RTK query, and React Router is employed for routing. The styling was
revamped using a utility-first approach with my own utility classes, which bear a resemblance to Tailwind CSS,
supplemented with default global styles. To manage unused classes, PurceCSS was utilized to remove them from the
production build, resulting in a surprisingly lean 1600 lines of CSS.


#### Future Enhancements and Learning Path
Looking ahead, I aspire to expand my knowledge by learning Node.js and creating my own API for the application. I plan
to incorporate user authentication and a database for user data storage using MongoDB. Furthermore, I aim to refactor
the application to utilize TypeScript and Next.js, and transition to MUI library for styled components and Tailwind for
utility classes.


---
#### Links
The original version of the application can be found in the branch `v1` of this repository. The refactored version is
located in the `master` branch. 

- [Live Demo (New Version)](https://forkify-mkk.netlify.app/)
- [Live Demo (Original Version)](https://forkify-v1-mkk.netlify.app/)



