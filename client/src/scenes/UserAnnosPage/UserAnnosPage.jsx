import React, { useEffect } from "react";
import styles from "./UserAnnosPage.module.scss";
import AnnoFold from "../../components/annoFold/AnnoFold";
import { useInfo } from "../../App";
import Map from "../../components/map/Map";
import Search from "../../components/search/Search";
import importAll from "../../hooks/importAll";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "../../components/dropdown/Dropdown";
import RangeMenu from "../../components/RangeMenu/RangeMenu";
import warning from "../../assets/warning.svg";
import Loader from "../../components/loader/Loader";

const optionsImgURLs = importAll(
  require.context("../../assets/options", false, /\.(png|jpe?g|svg)$/)
);

const paginationImgURLs = importAll(
  require.context("../../assets/pagination", false, /\.(png|jpe?g|svg)$/)
);

const optionsData = [
  { text: "Для вас", imgURL: optionsImgURLs["arrows.svg"] },
  { text: "Новіші", imgURL: "" },
  { text: "Ціна за зростанням", imgURL: optionsImgURLs["arrowup.svg"] },
  { text: "Ціна за спаданням", imgURL: optionsImgURLs["arrowdown.svg"] },
  { text: "Площа за зростанням", imgURL: optionsImgURLs["arrowup.svg"] },
  { text: "Площа за спаданням", imgURL: optionsImgURLs["arrowdown.svg"] },
];

function PaginatedItems({ items, itemsPerPage }) {
  const [itemOffset, setItemOffset] = useState(0);
  const [activePage, setActivePage] = useState(1);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
    setActivePage(event.selected + 1);
  };

  return (
    <div className={styles.listWrapper}>
      <div className={`${styles.annosContainer} `}>
        {currentItems.map((anno) => (
          <AnnoFold key={uuidv4()} data={anno} type="AnnosPage" />
        ))}
      </div>
      <ReactPaginate
        className={styles.pagination}
        breakLabel="..."
        nextLabel={
          <div
            className={`${styles.imgContainer} ${
              activePage === pageCount && styles.disabled
            }`}
          >
            <img src={paginationImgURLs["arrownext.svg"]} alt="next" />
          </div>
        }
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={
          <div
            className={`${styles.imgContainer} ${
              activePage === 1 && styles.disabled
            }`}
          >
            <img src={paginationImgURLs["arrowback.svg"]} alt="prev" />
          </div>
        }
        renderOnZeroPageCount={null}
        disableInitialCallback={true}
        activeClassName={styles.activePage}
      />
    </div>
  );
}

export default function UserAnnosPage({ type }) {
  const { navbarHeight } = useInfo();
  const [annosAmount, setAnnosAmount] = useState(0);
  const [sortOption, setSortOption] = useState(0);
  const [cadastrInfo, setCadastrInfo] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (type === "announcments") {
      fetchMyAnnos();
    } else if (type === "wishlist") {
      fetchWishlist();
    }
  }, []);

  const fetchMyAnnos = () => {
    fetch(`${process.env.REACT_APP_URL}/api/user/announcments`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then(({ announcments }) => {
        setAnnosAll(announcments);
        setIsLoaded(true);
      });
  };

  const fetchWishlist = () => {
    fetch(`${process.env.REACT_APP_URL}/api/user/wishlist`, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    })
      .then((res) => res.json())
      .then(({ wishlist }) => {
        setAnnosAll(wishlist);
        setIsLoaded(true);
      });
  };

  //Sorting by options
  const [annosAll, setAnnosAll] = useState([]);

  useEffect(() => {
    if (annosAll.length) {
      // setAnnosAll(annosAll);
      setCadastrInfo(annosAll.map((anno) => anno.cadastrInfo));
      setAnnosAmount(annosAll.length);
    }
  }, [annosAll]);

  const [sortedItems, setSortedItems] = useState([]);

  useEffect(() => {
    sortArray(
      sortOption,
      (sortedItems.length && isPriceActive) ||
        (sortedItems.length && isSquareActive)
        ? sortedItems
        : annosAll
    );
  }, [sortOption]);

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption);
  };

  const sortArray = (sortOption, annos) => {
    switch (+sortOption) {
      case 0:
        break;
      case 1:
        setSortedItems(
          [...annos].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        break;
      case 2:
        setSortedItems([...annos].sort((a, b) => a.price - b.price));
        break;
      case 3:
        setSortedItems([...annos].sort((a, b) => b.price - a.price));
        break;
      case 4:
        setSortedItems(
          [...annos].sort((a, b) => +a.cadastrInfo.area - +b.cadastrInfo.area)
        );
        break;
      case 5:
        setSortedItems(
          [...annos].sort((a, b) => +a.cadastrInfo.area - +b.cadastrInfo.area)
        );
        break;
      default:
        // Default sorting, no sorting applied
        break;
    }
  };

  //Price range
  const [isPriceRangeShown, togglePriceRange] = useState(false);
  const [priceRange, setPriceRange] = useState({
    minValue: "",
    maxValue: "",
  });
  const [isPriceActive, setPriceActive] = useState(false);

  //Square range
  const [isSquareRangeShown, toggleSquareRange] = useState(false);
  const [squareRange, setSquareRange] = useState({
    minValue: "",
    maxValue: "",
  });
  const [isSquareActive, setSquareActive] = useState(false);

  useEffect(() => {
    if (annosAll.length) {
      setPriceRange(() => {
        const sortedByPrice = annosAll.sort((a, b) => a.price - b.price);
        const minP = sortedByPrice[0].price;
        const maxP = sortedByPrice[sortedByPrice.length - 1].price;
        return { minValue: minP, maxValue: maxP };
      });
      setSquareRange(() => {
        const sortedBySquare = annosAll.sort(
          (a, b) => +a.cadastrInfo.area - +b.cadastrInfo.area
        );
        const minS = sortedBySquare[0].cadastrInfo.area;
        const maxS = sortedBySquare[sortedBySquare.length - 1].cadastrInfo.area;
        return { minValue: minS, maxValue: maxS };
      });
    }
  }, [annosAll]);

  useEffect(() => {
    if (annosAll.length && !isSquareActive)
      setSquareRange(() => {
        const sortedBySquare = annosAll.sort(
          (a, b) => +a.cadastrInfo.area - +b.cadastrInfo.area
        );
        const minS = sortedBySquare[0].cadastrInfo.area;
        const maxS = sortedBySquare[sortedBySquare.length - 1].cadastrInfo.area;
        return { minValue: minS, maxValue: maxS };
      });
  }, [isSquareActive]);

  useEffect(() => {
    if (annosAll.length && !isPriceActive)
      setPriceRange(() => {
        const sortedByPrice = annosAll.sort((a, b) => a.price - b.price);
        const minP = sortedByPrice[0].price;
        const maxP = sortedByPrice[sortedByPrice.length - 1].price;
        return { minValue: minP, maxValue: maxP };
      });
  }, [isPriceActive]);

  useEffect(() => {
    const { minValue, maxValue } = priceRange;

    if (annosAll.length && !isSquareActive) {
      setSortedItems(
        annosAll.filter(({ price }) => price >= +minValue && price <= +maxValue)
      );
    }
    if (annosAll.length && isSquareActive) {
      setSortedItems((prevState) =>
        prevState.filter(
          ({ price }) => price >= +minValue && price <= +maxValue
        )
      );
    }
  }, [priceRange]);

  useEffect(() => {
    const { minValue, maxValue } = squareRange;
    if (annosAll.length && !isPriceActive) {
      setSortedItems(
        annosAll.filter(
          ({ cadastrInfo }) =>
            +cadastrInfo.area >= +minValue && +cadastrInfo.area <= +maxValue
        )
      );
    }
    if (annosAll.length && isPriceActive) {
      setSortedItems((prevState) =>
        prevState.filter(
          ({ cadastrInfo }) =>
            +cadastrInfo.area >= +minValue && +cadastrInfo.area <= +maxValue
        )
      );
    }
  }, [squareRange]);

  useEffect(() => {
    if (sortedItems.length) setAnnosAmount(sortedItems.length);
  }, [sortedItems]);

  const stylesBtn = {
    purple: {
      border: "2px solid #999ac6",
      backgroundColor: "#999ac6",
      color: "#fff",
    },
    light: {
      border: "2px solid #c2c2dd",
      backgroundColor: "#c2c2dd",
      color: "#fff",
    },
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.mapWrapper}
        style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      >
        <Map landData={cadastrInfo} />
      </div>
      <div
        className={`${styles.annosWrapper}`}
        style={{ height: `calc(100vh - ${navbarHeight}px)` }}
      >
        <h3>
          {type === "announcments"
            ? "Ваші оголошення"
            : type === "wishlist"
            ? "Обрані"
            : ""}
        </h3>
        {!isLoaded ? (
          <Loader />
        ) : !annosAll.length ? (
          <div className={styles.zeroAnnos}>
            <div className={styles.imgContainer}>
              <img src={warning} alt="warning" />
            </div>
            <p>
              наразі оголошення відсутні{" "}
              {`в категорії "${
                type === "announcments"
                  ? "Ваші оголошення"
                  : type === "wishlist"
                  ? "Обрані"
                  : ""
              }"`}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.searchOptions}>
              <Search type="AnnosPage" />
              <div className={styles.options}>
                <div className={styles.filters}>
                  <button
                    style={isPriceActive ? stylesBtn.purple : stylesBtn.light}
                    onClick={() => {
                      togglePriceRange((prevState) => !prevState);
                      toggleSquareRange(false);
                    }}
                  >
                    Ціна
                  </button>
                  {isPriceRangeShown && (
                    <RangeMenu
                      toggleRange={togglePriceRange}
                      initialValues={priceRange}
                      setRange={setPriceRange}
                      isActive={setPriceActive}
                      activity={isPriceActive}
                    />
                  )}
                  <button
                    style={isSquareActive ? stylesBtn.purple : stylesBtn.light}
                    onClick={() => {
                      toggleSquareRange((prevState) => !prevState);
                      togglePriceRange(false);
                    }}
                  >
                    Площа
                  </button>
                  {isSquareRangeShown && (
                    <RangeMenu
                      toggleRange={toggleSquareRange}
                      initialValues={squareRange}
                      setRange={setSquareRange}
                      isActive={setSquareActive}
                      activity={isSquareActive}
                    />
                  )}
                </div>
                <div className={styles.sort}>
                  <p>
                    <span>{annosAmount}</span> оголошень
                  </p>
                  <div className={styles.selectWrapper}>
                    <Dropdown
                      options={optionsData}
                      onSelectOption={handleSortChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <PaginatedItems
              items={
                (sortedItems.length && isPriceActive) ||
                (sortedItems.length && isSquareActive)
                  ? sortedItems
                  : annosAll
              }
              itemsPerPage={10}
            />
          </>
        )}
      </div>
    </div>
  );
}
