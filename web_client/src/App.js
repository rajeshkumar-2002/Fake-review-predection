import TextRoute from "./components/pages/TextRoute";
import UrlRoute from "./components/pages/UrlRoute";
import React, { useEffect, useState } from "react";
import cm from "./images/Confusion_Matrix.png";
import gnf from "./images/Genuine_And_Fake_Percentage.png";
import prvsroc from "./images/Precision_Recal_VS_ROC_Curve.png";
import pr from "./images/Precision_Recall_Curve.png";
import roc from "./images/ROC_Curve.png";
import "./App.css";
import axios from "axios";

function App() {
  const [activeTab, setActiveTab] = useState("text");
  const [accuracy, setAccuracy] = useState("Nill");
  const [f1, setF1] = useState("Nill");
  const [precision, setPrecision] = useState("Nill");
  const [recall, setRecall] = useState("Nill");

  useEffect(() => {
    axios
      .get("http://localhost:5000/data")
      .then((response) => {
        setAccuracy(response.data.data.Accuracy);
        setF1(response.data.data.F1);
        setPrecision(response.data.data.Precision);
        setRecall(response.data.data.Recall);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="text-center">
            Fake Review Prediction using <b>ML</b>
          </h2>

          <div style={{ paddingTop: "40px" }}>
            <p
              data-bs-toggle="collapse"
              href="#introduction"
              style={{ cursor: "pointer" }}
              aria-expanded="false"
              aria-controls="introduction"
            >
              What is Fake Review Prediction ?
            </p>

            <div className="collapse" id="introduction">
              <div className="card shadow card-body">
                <p style={{ textAlign: "justify" }}>
                  Fake review prediction is an important task in the digital era
                  where businesses rely heavily on customer feedback to drive
                  their sales and reputation. With the rise of e-commerce and
                  online platforms, consumers have access to an abundance of
                  product and service reviews, which they use as are ference
                  before making a purchase. However, not all reviews are
                  genuine, and some are written by individuals with the
                  intention of manipulating the opinions of potential customers.
                  This is where fake review prediction comes in, as it helps
                  identify and remove fake reviews that may influence the
                  decision of potential customers, and help businesses and
                  websites to maintain the integrity of their reviews. The task
                  of fake review prediction is typically done using machine
                  learning , which analyze the text of reviews and classify them
                  as fake or genuine based on various features such as review
                  rating and purchase. With the help of these techniques, fake
                  review prediction can improve the overall user experience, by
                  providing them with genuine reviews, and help businesses to
                  maintain the integrity of their reviews.
                </p>
              </div>
              <br />
            </div>
          </div>

          <p
            data-bs-toggle="collapse"
            href="#relatedLink"
            style={{ cursor: "pointer" }}
            aria-expanded="true"
            aria-controls="relatedLink"
          >
            Related Link{" "}
          </p>
          <div className="collapse" id="relatedLink">
            <div className="card shadow">
              <div className="card-body">
                <h5>Dataset</h5>
                <div className="paddl50">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <b>Source</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">Kaggle</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Description</b>
                        </td>
                        <td></td>
                        <td>
                          <p
                            className="paragraphclr"
                            style={{ textAlign: "justify" }}
                          >
                            The Amazon reviews dataset consists of reviews from
                            amazon. The data span a period of 18 years,
                            including ~35 million reviews up to March 2013.
                            Reviews include product and user information,
                            ratings, and a plaintext review. For
                            moreinformation, please refer to the following
                            paper: J. McAuley and J. Leskovec.Hidden factors and
                            hidden topics: understanding rating dimensions
                            withreviewtext. RecSys, 2013.
                          </p>
                          <p
                            className="paragraphclr"
                            style={{ textAlign: "justify" }}
                          >
                            The Amazon reviews polarity dataset is constructed
                            by taking review score 1 and 2 as negative, and 4
                            and 5 as positive. Samples of score 3 is ignored.
                            Inthe dataset, class 1 is the negative and class 2
                            is the positive.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Link</b>
                        </td>
                        <td></td>
                        <td>
                          <a
                            href="https://www.kaggle.com/datasets/kritanjalijain/amazon-reviews"
                            className="link-primary"
                          >
                            Dataset
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <br />
                <h5>Code</h5>
                <div className="paddl50">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <b>Source</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">Github</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Link</b>
                        </td>
                        <td></td>
                        <td>
                          <a
                            href="https://github.com/rajeshkumar-2002/Fake-review-predection"
                            className="link-primary"
                          >
                            Github
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <br />
          </div>

          <div className="infoclass">
            <h3>Information on the Classifier</h3>
            <div className="card shadow">
              <div className="card-body">
                <h6>About Classifier</h6>
                <div className="paddl50">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <b>Model</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">
                          Support Vector Machine(SVM)
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Vectorizer</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">
                          Term Frequency-Inverse Document Frequency (TF-IDF)
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <b>Test-Tain splitting</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">70%-30%</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Spelling Correction Library</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">TextBlob</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Stemmer</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">PorterStemmer</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br />
                <h6>Evaluation Results</h6>
                <div className="paddl50">
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <b>Accuracy</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">{accuracy}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Precision</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">{precision}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Recall</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">{recall}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>F-1 Score</b>
                        </td>
                        <td></td>
                        <td className="paragraphclr">{f1}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="classgraph py-4" style={{ width: "530px" }}>
            <h3>Graph's</h3>
            <div id="carouselExample" className="carousel slide">
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <p>Confusion Matrix - SVM</p>
                  <img src={cm} alt="Confusion_Matrix" />
                </div>
                <div className="carousel-item">
                  <p>ROC Curve - SVM</p>
                  <img src={roc} alt="Genuine_And_Fake_Percentage" />
                </div>
                <div className="carousel-item">
                  <p>Precision Recall Curve - SVM</p>
                  <img src={pr} alt="Genuine_And_Fake_Percentage" />
                </div>
                <div className="carousel-item">
                  <p>Precision Recal VS ROC Curve - SVM</p>
                  <img src={prvsroc} alt="Genuine_And_Fake_Percentage" />
                </div>
                <div className="carousel-item">
                  <p>Genuine And Fake Percentage</p>
                  <img src={gnf} alt="Genuine_And_Fake_Percentage" />
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                style={{ color: "#000000" }}
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>

          <br />
          <ul className="nav nav-pills nav-justified">
            <li className="nav-item" style={{ cursor: "pointer" }}>
              <a
                className={`nav-link ${activeTab === "text" ? "active" : ""}`}
                onClick={() => setActiveTab("text")}
                aria-current="page"
              >
                Review Text
              </a>
            </li>
            <li className="nav-item" style={{ cursor: "pointer" }}>
              <a
                className={`nav-link ${activeTab === "url" ? "active" : ""}`}
                onClick={() => setActiveTab("url")}
              >
                Review Url
              </a>
            </li>
          </ul>
          <div className="tab-content">
            {activeTab === "text" && (
              <div className="tab-pane active">
                <TextRoute />
              </div>
            )}
            {activeTab === "url" && (
              <div className="tab-pane active">
                <UrlRoute />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
