export const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};

export const formatDecimalNumber = (num: number): string => {
  return num.toFixed(2);
};
  



const monthCode: {[key: string]: string} = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  "10": "Oct",
  "11": "Nov",
  "12": "Dec"
}


export const formatISODateToDDMMYYYY = (isoDate : string) =>  {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


export const convertDateToISOString = (dateStr: string): string => {
  const [day, month, year] = dateStr.split("/").map(Number);
  const dateObj = new Date(year, month - 1, day);
  return dateObj.toISOString();
};


export const formatDateToReadable = (dateString: string) => {
  const date = dateString.split("T")[0].split("-");
  const day = date[2];
  const month = monthCode[date[1]];
  const year = date[0];
  return `${day} ${month} ${year}`;
};




// Function to get initials from a name
export const getInitials = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) return name.charAt(0).toUpperCase(); // Single word name
  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
};

// Function to get a random color from theme.palette.others
export const getRandomColor = () => {
  const colors = [
    "#af81ba", // pink
    "#597c7c", // turquoise
    "#93674f", // brown
    "#934f6f", // magenta
    "#3f82b2", // blue
    "#97a0ac", // navy-grey
    "#7f9161", // army-green
    "#cab361", // gold
    "#be6c49", // orange
    "#826cb0", // purple
    "#626070", // navy
    "#277c78", // green
    "#82c9d7", // cyan
    "#c94736", // red
    "#f2cdac", // yellow
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};



export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  
  // Convert to local time
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};




export const dateSuffix = {
  "1": "st",
  "2": "nd",
  "3": "rd",
  "4": "th",
  "5": "th",
  "6": "th",
  "7": "th",
  "8": "th",
  "9": "th",
  "10": "th",
  "11": "th",
  "12": "th",
  "13": "th",
  "14": "th",
  "15": "th",
  "16": "th",
  "17": "th",
  "18": "th",
  "19": "th",
  "20": "th",
  "21": "st",
  "22": "nd",
  "23": "rd",
  "24": "th",
  "25": "th",
  "26": "th",
  "27": "th",
  "28": "th",
  "29": "th",
  "30": "th",
  "31": "st"
};




// Function to capitalize the first letter of a single word
export const capitalizeWord = (word: string): string => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// Function to capitalize the first letter of each word in a sentence or phrase
export const capitalizeSentence = (sentence: string): string => {
  return sentence
    .split(" ")
    .map((word) => capitalizeWord(word))
    .join(" ");
};