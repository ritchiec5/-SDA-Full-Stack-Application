import React from "react";
import { Column } from '@ant-design/charts';

const ColumnChart = props => {
    const data = [
        { month: 'January', value: props.column_data[0] },
        { month: 'February', value: props.column_data[1] },
        { month: 'March', value: props.column_data[2] },
        { month: 'April', value: props.column_data[3] },
        { month: 'May', value: props.column_data[4] },
        { month: 'June', value: props.column_data[5] },
        { month: 'July', value: props.column_data[6] },
        { month: 'August', value: props.column_data[7] },
        { month: 'September', value: props.column_data[8] },
        { month: 'October', value: props.column_data[9] },
        { month: 'November', value: props.column_data[10] },
        { month: 'December', value: props.column_data[11] },
    ];

    const config = {
        data,
        xField: 'month',
        yField: 'value',
        colorField: 'month',
        palette: 'soft pastel',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        xAxis: {
            label: {
                autoHide: true,
                autoRotate: false,
            },
        },
        legend: {
            layout: 'horizontal',
            position: 'right',
            offsetX: 5,
        }
    };
    return <Column {...config} />;
};

export default ColumnChart