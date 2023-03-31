import { useState } from "react";
import axios from "axios";

function TextRoute() {
  const [review, setReview] = useState();

  const [sum, setSum] = useState();
  const [result, setResult] = useState();
  const [words, setWords] = useState({});
  const [error, setError] = useState(false);

  const handlesubmit = (e) => {
    e.preventDefault();
    const data = { review: review };
    axios
      .post("http://localhost:5000/predict", data)
      .then((response) => {
        console.log(response.data);
        setSum(response.data.Data.Highlighted_text_sum);
        setResult(response.data.Data.result);
        if (Object.keys(response.data.Data.words).length !== 0) {
          setWords(response.data.Data.words);
        }
        setError(false);
      })
      .catch((error) => {
        setSum("");
        setResult("");
        setWords("");
        console.log(error);
        setError(true);
      });
  };
  
  return (
    <div className="mt-4">
    <h4>Fake Review Classifier</h4>
      {!error && sum && result && words && (
        <div class="card my-4">
          <div class="card-body">
            <p>
              <span style={{ fontWeight: "bold" }}>Result : </span>
              {result === 1 ? (
                <span style={{ color: "red" }}>
                  The given Review is{" "}
                  <span style={{ fontWeight: "bold", color: "red" }}>Fake</span>{" "}
                  Review
                </span>
              ) : (
                <span style={{ color: "green" }}>
                  The given Review is{" "}
                  <span style={{ fontWeight: "bold", color: "green" }}>
                    Genuine
                  </span>{" "}
                  Review
                </span>
              )}
            </p>
            <p>
              <span style={{ fontWeight: "bold" }}>Highlighted text sum :</span>{" "}
              {sum}
            </p>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Word</th>
                  <th scope="col">Weight</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(words).length !== 0 &&
                  Object.entries(words).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}</td>
                      <td>{value.toFixed(3)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p>Enter Review:</p>
      <form onSubmit={handlesubmit} className="mb-3">
        <div className="form-floating">
          <textarea
            type="email"
            className="form-control"
            style={{ height: "130px" }}
            id="floatingInput"
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
            }}
            placeholder="Enter the Review"
            name="review"
            required
          ></textarea>
        </div>
        <br />
        <input
          type="submit"
          className="btn btn-primary"
          value="Predict"
          id="check-review-button"
        />
      </form>
    </div>
  );
}

export default TextRoute;
