import React from "react";
import moment from 'moment';
import { Line, Column, Pie } from '@ant-design/charts';

const LineChart = props => {

    const data = [
        { date: moment().startOf('week').format('DD/MM'), value: props.line_data[0] },
        { date: moment().startOf('week').add(1, 'days').format('DD/MM'), value: props.line_data[1] },
        { date: moment().startOf('week').add(2, 'days').format('DD/MM'), value: props.line_data[2] },
        { date: moment().startOf('week').add(3, 'days').format('DD/MM'), value: props.line_data[3] },
        { date: moment().startOf('week').add(4, 'days').format('DD/MM'), value: props.line_data[4] },
        { date: moment().startOf('week').add(5, 'days').format('DD/MM'), value: props.line_data[5] },
        { date: moment().startOf('week').add(6, 'days').format('DD/MM'), value: props.line_data[6] },
    ];

    const config = {
        data,
        xField: 'date',
        yField: 'value',
        colorField: 'date',
        color: props.color,
        point: {
            visible: true,
            size: 4,
            shape: 'circule',
            style: {
                fill: 'white',
                stroke: props.color,
                lineWidth: 2,
            },
        },
    };
    return <Line {...config} />;
};

export default LineChart