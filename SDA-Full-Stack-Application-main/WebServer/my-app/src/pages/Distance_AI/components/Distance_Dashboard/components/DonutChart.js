import React from "react";
import { Pie } from '@ant-design/charts';

const DonutChart = props => {
    
    const data = [
        {
            type: 'Safe Distancing Violation',
            value: props.TodaySD_data,
        },
        {
            type: 'Dangerous Behaviour',
            value: props.TodayDB_data,
        },
    ];
    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        color: ['#FF5757', '#FF914D'],
        radius: 1,
        innerRadius: 0.6,
        legend: {
            layout: 'horizontal',
            position: 'bottom',
        },
        label: {
            type: 'inner',
            offset: '-50%',
            content: '{value}',
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                },
                content: 'AntV\nG2Plot',
            },
        },
    };
    return <Pie {...config} />;
};

export default DonutChart