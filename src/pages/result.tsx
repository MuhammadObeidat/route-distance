import styles from './index.module.css'
import { useQueryParams } from '@/hooks/useQueryParams';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import format from 'date-fns/format';

 const Result = () =>  {
  const {queryParams}= useQueryParams() as any;
  const cities = !!queryParams?.intermediate? JSON.parse(queryParams?.intermediate).map((c:string, idx:number)=> `${c}${idx !== JSON.parse(queryParams?.intermediate).length-1?' & ':''}`):"N/A";
  const tripDate = !!queryParams?.date? format(new Date(JSON.parse(queryParams?.date)), 'yyyy-MM-dd') :'N/A';
    return (
        <main> 
          <Grid className={styles.container} container spacing={5} alignItems="center" justifyContent="center" direction="column" >
                    <h1>Route Search Result</h1>
                    <Grid item sx={{minWidth:200}}>
                    <Box display="flex" alignItems="center">
                     <Typography className={styles.property} variant='body1'>Origin city:</Typography>
                     <Typography className={styles.value} variant='body2'>{queryParams?.origin}</Typography>
                    </Box>
                    <hr />
                    <Box display="flex" alignItems="center">
                     <Typography className={styles.property} variant='body1'>Destination city:</Typography>
                     <Typography className={styles.value} variant='body2'>{queryParams?.destination}</Typography>
                    </Box>
                     <hr />
                    <Box display="flex" alignItems="center">
                     <Typography className={styles.property} variant='body1'>Intermediate cities:</Typography>
                     <Typography className={styles.value} variant='body2'>{cities}</Typography>
                    </Box>
                     <hr />
                    <Box display="flex" alignItems="center">
                     <Typography className={styles.property} variant='body1'>Trip Date:</Typography>
                     <Typography className={styles.value} variant='body2'>{tripDate}</Typography>
                    </Box>
                     <hr />
                    <Box display="flex" alignItems="center">
                     <Typography className={styles.property} variant='body1'>Passengers:</Typography>
                     <Typography className={styles.value} variant='body2'>{queryParams?.passengers}</Typography>
                    </Box>
                    <hr />
                    <Box display="flex" alignItems="center">
                     <Typography className={styles.property} variant='body1'>The total route distance is:</Typography>
                     <Typography className={styles.distance} variant='body2'>{queryParams?.distance} KM</Typography>
                    </Box>
                    </Grid>
          </Grid>
        </main>
    );
}
export default Result;

