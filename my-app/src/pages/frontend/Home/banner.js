import React, { useEffect, useState } from "react";
import BrandService from "../../../Service/BrandSV";

function Banner() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    BrandService.getAll()
      .then((response) => {
        setBrands(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load brands.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const styles = {
    frameStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "300px", // Set a fixed height for the frames
      overflow: "hidden"
    },
    imageStyle: {
      width: "100%",
      height: "auto", // Ensure the image scales correctly
      objectFit: "cover" // Ensure the image covers the frame
    },
    nameStyle: {
      fontSize: "24px", // Make the brand name larger
      fontWeight: "bold", // Make the brand name bold
      color: "#000", // Set the brand name color
    },
    descStyle: {
      fontSize: "18px", // Make the description text larger
      color: "rgba(85, 85, 85, 0.9)", // Set the description text color with reduced opacity
      backgroundColor: "rgba(255, 255, 255, 0.5)", // Add a more transparent background
      padding: "10px", // Add some padding around the description
      borderRadius: "5px", // Add rounded corners to the background
    },
    container: {
      maxWidth: "960px",
      margin: "0 auto",
      padding: "0 15px"
    },
    secBanner: {
      paddingTop: "95px",
      paddingBottom: "55px"
    },
    '@media (max-width: 991px)': {
      container: {
        maxWidth: "720px",
      }
    },
    '@media (max-width: 767px)': {
      container: {
        maxWidth: "100%",
      },
      secBanner: {
        paddingTop: "50px",
        paddingBottom: "30px",
      },
      frameStyle: {
        height: "200px", // Adjust height for mobile
      },
      nameStyle: {
        fontSize: "18px", // Adjust font size for mobile
      },
      descStyle: {
        fontSize: "14px", // Adjust font size for mobile
      }
    }
  };

  return (
    <div style={styles.secBanner}>
      <div style={styles.container}>
        <div className="row">
          {brands.map((brand) => (
            <div className="col-md-6 p-b-30 m-lr-auto" key={brand.id}>
              <div style={styles.frameStyle}>
                <img
                  src={`http://localhost:5011/api/admin${brand.image}`}
                  alt={brand.name}
                  style={styles.imageStyle}
                />
                <a
                  href={brand.link || "#"}
                  className="block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span style={styles.nameStyle}>
                      {brand.name}
                    </span>
                    <span style={styles.descStyle}>
                      {brand.metadesc}
                    </span>
                  </div>
                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09"></div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Banner;
