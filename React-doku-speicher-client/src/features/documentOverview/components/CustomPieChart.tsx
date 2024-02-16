import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Legend, Tooltip, Label } from "recharts";

import { RootState } from "../../../redux/store";
import useCalculateTotalSizeByType from "../../../hooks/useCalculateTotalSizeByType ";

const CustomPieChart = () => {
  const documents = useSelector(
    (state: RootState) => state.documents.documents
  );

  const totalSizeByType = {
    pdf: useCalculateTotalSizeByType(documents, "pdf"),
    xlsx: useCalculateTotalSizeByType(documents, "xlsx"),
    docx: useCalculateTotalSizeByType(documents, "docx"),
    txt: useCalculateTotalSizeByType(documents, "txt"),
    images:
      useCalculateTotalSizeByType(documents, "jpg") +
      useCalculateTotalSizeByType(documents, "png") +
      useCalculateTotalSizeByType(documents, "jpeg"),
  };

  const totalFileSize = parseFloat(
    Object.values(totalSizeByType)
      .reduce((sum, size) => sum + size, 0)
      .toFixed(2)
  );

  const data = [
    { name: "PDF", value: totalSizeByType.pdf },
    { name: "Excel", value: totalSizeByType.xlsx },
    { name: "Word", value: totalSizeByType.docx },
    { name: "Txt", value: totalSizeByType.txt },
    { name: "Images", value: totalSizeByType.images },
  ];

  const COLORS = ["#f5395f", "#00C49F", "#FFBB28", "#0088FE", "#8884d8"];

  return (
    <PieChart
      width={250}
      height={250}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill="#8884d8"
        paddingAngle={5}
        dataKey="value"
        labelLine={false}
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
        <Label
          value={`${totalFileSize} KB`}
          position="center"
          fontSize="13px"
          fontWeight={700}
          fill="#2e3a47"
          style={{ textAnchor: "middle", dominantBaseline: "central" }}
        />
      </Pie>
      <Tooltip />
      <Legend
        align="center"
        verticalAlign="bottom"
        wrapperStyle={{ fontSize: "12px", marginTop: "-5px" }}
        layout="horizontal"
      />
    </PieChart>
  );
};

export default CustomPieChart;
