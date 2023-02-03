import * as React from "react"
import "./index.css"
import { Select, Layout, Space, Button } from "antd"
import { useEffect, useState } from "react"
import csData from "./cs-2019.json"
import itData from "./it-2019.json"
import grades from "./grade.json"

var major = [
  {
    value: "cs",
    label: "cs",
  },
  {
    value: "it",
    label: "it",
  },
]

const start = 1
const end = 8
const semester = Array.from({ length: end - start + 1 }, (_, i) => start + i)

export default function Gpa() {
  const [courses, setCourses] = useState([])
  const [sesmt, setSemester] = useState("")
  const [course, setCourse] = useState("")
  const [grade, setGrade] = useState("")
  const [totalGpa, setTotalGpa] = useState(0)
  const [courseData, setCourseData] = useState([])

  const majorChange = value => {
    const course = []
    if (value == "cs") {
      for (let subjectsKey of csData.curriculum.subjects) {
        for (let c of subjectsKey.subjects) {
          course.push(c)
        }
      }
      major = [
        {
          value: "cs",
          label: "cs",
        },
      ]
      setCourses(course)
    } else {
      for (let subjectsKey of itData.curriculum.subjects) {
        for (let c of subjectsKey.subjects) {
          course.push(c)
        }
      }
      major = [
        {
          value: "it",
          label: "it",
        },
      ]
      setCourses(course)
    }
    console.log(courses)
  }

  const semesterChange = value => {
    console.log("value=", value)
    setSemester(value)
  }

  const courseChange = value => {
    console.log("value=", value)
    setCourse(value)
  }

  const gradeChange = value => {
    console.log("value=", value)
    setGrade(value)
  }

  const summitData = () => {
    const courseD = courseData
    courseD.push({
      semester: sesmt,
      courseCode: course,
      course: courses.find(item => item.code == course).name,
      grade: grade,
    })
    setCourseData([...courseD])
    localStorage.setItem("courseData", JSON.stringify(courseD))
    console.log("courseD=", courseData)
  }

  useEffect(() => {
    const lld = JSON.parse(localStorage.getItem("courseData"))
    console.log("lld1=", lld)
    if (lld != null) {
      setCourseData(lld)
    }
    setTimeout(() => {
      console.log("lld2=", courseData)
    }, 1000)
  }, [])

  return (
    <div>
      <div className="header">
        <h1>Grade Tracker</h1>
        <h2>Please choose your major</h2>
        <Select
          defaultValue="select"
          style={{
            width: 120,
          }}
          onChange={majorChange}
          options={major}
        />
      </div>

      <div className="bottom clearfix">
        <div className="left">
          <h3>Please Add Semester</h3>
          <Select
            defaultValue="select"
            style={{
              width: 120,
            }}
            onChange={semesterChange}
            options={semester.map(item => {
              return {
                value: item,
                label: item,
              }
            })}
          />
          <h3>Please Add Course</h3>
          <Select
            defaultValue="select"
            style={{
              width: 120,
            }}
            onChange={courseChange}
            options={courses.map(item => {
              return {
                value: item.code,
                label: `${item.code}----${item.name}`,
              }
            })}
          />

          <h3>Please Add Grade</h3>
          <Select
            showSearch
            defaultValue="select"
            style={{
              width: 120,
            }}
            onChange={gradeChange}
            options={grades.map(g => {
              return {
                value: g.value,
                label: `${g.name} ---- ${g.value}`,
              }
            })}
          />

          <Button type="primary" className="submit-btn" onClick={summitData}>
            submit
          </Button>
        </div>
        <div className="right">
          <h3>GPA</h3>
          <div className="data">
            {Object.keys(
              courseData.reduce(function (acc, item) {
                var key = item.semester
                if (!acc[key]) {
                  acc[key] = []
                }
                acc[key].push(item)
                return acc
              }, {})
            ).map(semester => {
              return (
                <div key={semester} className="item">
                  <div className="item__header">
                    <span>Semester{semester}</span>
                    <span
                      style={{
                        width: "50px",
                        float: "right",
                        marginRight: "10px",
                        border: "solid red 1px",
                      }}
                    >
                      {(
                        courseData
                          .filter(item => item.semester == semester)
                          .map(item => {
                            return item.grade == "exclude" ? 0 : item.grade
                          })
                          .reduce((acc, curr) => acc + curr, 0) /
                        courseData
                          .filter(item => item.semester == semester)
                          .filter(item => item.grade != "exclude").length
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="item_child">
                    <table>
                      <thead>
                        <tr>
                          <th>Course Code And Name</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseData
                          .filter(item => item.semester == semester)
                          .map(item => {
                            return (
                              <tr key={item.courseCode}>
                                <td>
                                  {item.courseCode} --- {item.course}{" "}
                                </td>
                                <td>
                                  {grades.find(g => g.value == item.grade).name}
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="right-total">
            <span>
              Total Gpa{" "}
              {(
                courseData
                  .map(item => {
                    return item.grade == "exclude" ? 0 : item.grade
                  })
                  .reduce((acc, curr) => acc + curr, 0) /
                courseData.filter(item => item.grade != "exclude").length
              ).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
