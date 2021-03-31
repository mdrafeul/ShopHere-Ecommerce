import React from 'react'
import {Helmet} from 'react-helmet'


const MetaData = ({title}) => {
    return (
        <Helmet>
            <title>{`${title}-ShopHere`}</title>
        </Helmet>
    )
}

export default MetaData