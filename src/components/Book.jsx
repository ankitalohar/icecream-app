import "./Book.css";

export default function Book() {
  return (
    <div className="wrapper">

      <h1 className="title">
        Turning Pages <br />
        With React
      </h1>

      <div className="book">

        <div className="pages">
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
          <div className="page"></div>
        </div>

        <div className="flips">
          <div className="flip flip1">
            <div className="flip flip2">
              <div className="flip flip3">
                <div className="flip flip4"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}