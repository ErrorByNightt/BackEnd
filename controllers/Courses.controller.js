import Courses from '../Models/Courses.model.js';





// add Course
export async function addCourse(req, res) {
  
    try {
      const {
        title,
        url,
        date,
        nbpage,
        language
      } = req.body
      console.log("body= ");
      console.log(req.body);
      if ( date <= 2023){
        if (!(title && url && nbpage && language )) {
          res.status(400).json({ message: 'All Fields are required' })
        }
        const course = await Courses.create({
          title,
          url:`${req.protocol}://${req.get('host')}/media/courses/${req.body.url}`,
          date,
          nbpage,
          language
        })
        res.send(course)
      }
      else{
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  }


  // get all courses
export async function getAllCourses  (req, res) {
    Courses.find()
    .then(response =>{
        res.json({
            response
        })
    })
    .catch(error => {
        res.json ({
            message: 'An error occured. '
        }) 
    })
  }
    
  //Delete Course
export  async function deleteCourse (req, res) {
    console.log(req.body)
      let course = await Courses.findById(req.body._id)
      if (course) {
        await course.remove()
        return res.send({ message: "Course" + course._id + " has been deleted" })
      } else {
        return res.status(404).send({ message: "Course does not exist" })
      }
    }