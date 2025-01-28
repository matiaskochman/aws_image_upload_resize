Objective
Develop a solution that dynamically resizes images on request. The solution should feature a
front end for uploading images and displaying a thumbnail grid of uploaded images. Your front
end application should utilize your endpoint for dynamically resizing images as needed. The
front end should be implemented using React and should also be responsive. Additionally, the
solution must be built on AWS, with all applications provisioned using Terraform. GitHub Actions
should be utilized to deploy the applications to AWS and support staging and production
environments. Frequent commits are expected, with early and often commit practices
encouraged. Your main goal for this project should be to showcase your knowledge of AWS
services by implementing a highly performant and scalable solution for the image resizing
service.
Requirements:
1. Technologies:
- TypeScript
- React
- Node.js
- Terraform
- AWS
- Docker (If needed)
- GitHub Actions
- Avoid using full-stack frameworks such as Next.js
2. Frontend:
- Implement a user interface for uploading images and displaying a thumbnail grid
of all images.
- Clicking an image should display a full screen image.
- Ensure the application is responsive and user-friendly.
- Do not skip styling, provide a visually appealing application.
- Write unit tests.
3. Image Resizing Service:
- Create a solution to handle image requests.
- It should resize images if the image does not exist in the requested size.
- GET : /images/{width}x{height}/{s3object}
- GET : /images/600x600/image.jpg
- Store the resized image in AWS S3.
4. Backend:
- Create a simple restful API to handle image uploads and retrieval.
- It should have an endpoint available to upload images.
- POST : /images
- It should have an endpoint to retrieve a list of all images that have been
uploaded.
- GET : /images
- Write unit tests.
5. Infrastructure:
- Use T erraform to provision all necessary AWS resources (S3, Lambda, API
Gateway, CloudFront, etc.).
- Implement infrastructure as code best practices, ensuring reusability and
modularity.
6. CI/CD:
- Set up GitHub Actions for automatic deployment to AWS.
- Ensure the pipeline supports both staging and production environments.
- Include testing, build, and deployment stages in the pipeline.
7. Version Control:
- Commit code changes early and often, showcasing a consistent development
process.
- Use meaningful commit messages to describe changes.
Submission Guidelines
- Time Allotment:
You have 72 hours to complete this challenge after starting. Aim to spend no more than
8 hours actively working on it. It is acceptable to submit something that is incomplete.
- Deliverables:
- Link to the deployed application.
- Link to a public GitHub repositories containing your solution. Monorepo and
multi-repo solutions are acceptable.
- A README file with clear instructions on how to run locally and deploy the
solution, including any prerequisites.
- Documentation explaining design choices, as well as any known limitations or
areas of improvement.
- Evaluation Criteria:
- Completeness of listed requirements.
- Cloud architecture of the image resizing service.
- Code quality and adherence to industry standards.
- Structure and readability of the T erraform code.
- Effective use of AWS services and GitHub Actions.
- User experience of the frontend application.
- Comprehensiveness of the README and documentation.
- Frequency and clarity of commits.
- Additional Notes:
- It is acceptable to submit an incomplete solution, but clear documentation of what
is functional and what is not is expected.
- Creativity and originality in the implementation will be valued.