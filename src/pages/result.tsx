import { useQueryParams } from '@/hooks/useQueryParams';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import styles from './index.module.css'

 const Result = () =>  {
  const {queryParams}= useQueryParams() as any;
  const cities = !!queryParams?.intermediate? JSON.parse(queryParams?.intermediate).map((c:string, idx:number)=> `${c}${idx !== JSON.parse(queryParams?.intermediate).length-1?' & ':''}`):"N/A";
  const tripDate = !!queryParams?.date? format(new Date(JSON.parse(queryParams?.date)), 'yyyy-MM-dd') :'N/A';
    return (
      <main className={styles.main}> 
          <Grid container>
              <Grid item xs={4} />
              <Grid item xs={4}>
              <Grid className={styles.container} container spacing={5} alignItems="center" justifyContent="center" direction="column" >
                    <h1>Route Search Result</h1>
                    <Grid item sx={{minWidth:200}}>
                    <Box display="flex" alignItems="center">
                     <p className={styles.property} >Origin city:</p>
                     <p className={styles.value}>{queryParams?.origin}</p>
                    </Box>
                    <hr />
                    <Box display="flex" alignItems="center">
                     <p className={styles.property} >Destination city:</p>
                     <p className={styles.value}>{queryParams?.destination}</p>
                    </Box>
                     <hr />
                    <Box display="flex" alignItems="center">
                     <p className={styles.property} >Intermediate cities:</p>
                     <p className={styles.value}>{cities}</p>
                    </Box>
                     <hr />
                    <Box display="flex" alignItems="center">
                     <p className={styles.property} >Trip Date:</p>
                     <p className={styles.value}>{tripDate}</p>
                    </Box>
                     <hr />
                    <Box display="flex" alignItems="center">
                     <p className={styles.property} >Passengers:</p>
                     <p className={styles.value}>{queryParams?.passengers}</p>
                    </Box>
                    <hr />
                    <Box display="flex" alignItems="center">
                     <p className={styles.property} >The total route distance is:</p>
                     <p className={styles.distance}>{queryParams?.distance} KM</p>
                    </Box>
                    </Grid>
          </Grid>
              </Grid>
              <Grid item xs={4} />
            </Grid>
     
        </main>
    );
}
export default Result;

