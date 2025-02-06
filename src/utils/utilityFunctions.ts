export const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
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
