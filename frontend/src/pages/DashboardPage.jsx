import {useContext, useEffect, useReducer} from 'react';
import axios from 'axios';
import {Chart} from 'react-google-charts'
import { Store } from '../Store';
import { DashbordReducer } from '../context/admin/dashbordReducer';
import { getError } from '../utils';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
    Row,
    Col,
    Card
} from 'react-bootstrap';



function DashboardPage() {
    //STATE:
    const {state} = useContext(Store);
    const {userInfo} = state;
    const [{loading, summary, error}, dispatch] = useReducer(DashbordReducer, {
        loading: true,
        error: ''
    })


    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`/api/orders/summary`, {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    }
                });
                dispatch({type: 'FETCH_SUCCESS', payload: data});
            } catch (err) {
                dispatch({
                    type: 'FETCH_FAIL', 
                    payload: getError(err),
                });
            }

        }

        fetchData();
    }, [userInfo])

    //FUNCTIONS:



    //RENDERED ELEMENTS:
    return (
        <div>
          <h1>Tabbleau de bord</h1>
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Row>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.users && summary.users[0]
                          ? summary.users[0].numUsers
                          : 0}
                      </Card.Title>
                      <Card.Text> Utilisateurs</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.orders && summary.users[0]
                          ? summary.orders[0].numOrders
                          : 0}
                      </Card.Title>
                      <Card.Text> Commandes</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>
                        {summary.orders && summary.users[0]
                          ? summary.orders[0].totalSales.toFixed(2)
                          : 0}€
                      </Card.Title>
                      <Card.Text> Commandes</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <div className="my-3">
                <h2>Sales</h2>
                {summary.dailyOrders.length === 0 ? (
                  <MessageBox>Pas de vente</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType="AreaChart"
                    loader={<div>Loading Chart...</div>}
                    data={[
                      ['Date', 'Ventes'],
                      ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                    ]}
                  ></Chart>
                )}
              </div>
              <div className="my-3">
                <h2>Categories</h2>
                {summary.productCategories.length === 0 ? (
                  <MessageBox>Pas de Categorie</MessageBox>
                ) : (
                  <Chart
                    width="100%"
                    height="400px"
                    chartType="PieChart"
                    loader={<div>Loading Chart...</div>}
                    data={[
                      ['Categorie', 'Produits'],
                      ...summary.productCategories.map((x) => [x._id, x.count]),
                    ]}
                  ></Chart>
                )}
              </div>
            </>
          )}
        </div>
      );
}

export default DashboardPage