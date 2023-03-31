import { useState } from "react";
import axios from "axios";

function UrlRoute() {
  const [error, setError] = useState(false);
  const [url, setUrl] = useState("");
  const [data, setData] = useState();

  const handlesubmit = (e) => {
    e.preventDefault();
    const data = { url: url };
    axios
      .post("http://localhost:5000/appurl", data)
      .then((response) => {
        setData(response.data.reviews);
        setError(false);
        console.log(response.data.reviews);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  return (
    <div className="mt-4">
      <h4>Fake Review Classifier</h4>
      {data &&
        (!error ? (
          <div>
            {data.map((review, index) => (
              <div className="card my-4" key={index}>
                <div className="card-body">
                  <p className="fs-5" style={{ fontWeight: "bold" }}>
                    {review.title}
                  </p>
                  <div className="d-flex justify-content-between py-2">
                    <div>
                      Rating :{" "}
                      {review.rating >= 3 ? (
                        <span style={{ color: "green" }}>{review.rating}</span>
                      ) : (
                        <span style={{ color: "red" }}>{review.rating}</span>
                      )}
                    </div>
                    <div>
                      {review.data.result === 1 ? (
                        <span style={{ color: "red" }}>Fake</span>
                      ) : (
                        <span style={{ color: "green" }}>Genuine</span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: "justify" }}>
                    {review.text.replace("READ MORE", "...")}
                  </div>
                  <div className="d-flex justify-content-between py-3">
                    <a
                      className="btn btn-primary"
                      data-bs-toggle="collapse"
                      href={"#" + index}
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      Show More
                    </a>
                  </div>
                  <div className="collapse" id={index}>
                    <p className="py-2">
                      <span style={{ fontWeight: "bold" }}>
                        Highlighted text sum :
                      </span>{" "}
                      {review.data.Highlighted_text_sum}
                    </p>
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Word</th>
                          <th scope="col">Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(review.data.words).length !== 0 &&
                          Object.entries(review.data.words).map(
                            ([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>{value.toFixed(3)}</td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>Error while geting the review</div>
        ))}
      <p>Enter Product Page URL</p>
      <div style={{ paddingBottom: "40px" }}>
        <form onSubmit={handlesubmit}>
          <div className="mb-3">
            <label htmlFor="url" className="form-label">
              URL
            </label>
            <input
              type="url"
              id="url"
              className="form-control"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
              aria-describedby="emailHelp"
              placeholder="https://www.flipkart.com/"
            />
            <div id="emailHelp" className="form-text">
              Paste the the url from the product page.
            </div>
          </div>
          <input
            type="submit"
            value="Get Reviews"
            className="btn btn-primary"
          />
        </form>
      </div>
    </div>
  );
}

export default UrlRoute;
