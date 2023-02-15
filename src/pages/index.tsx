import { forwardRef, SyntheticEvent, useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'use-debounce';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import {
  Button,
  AutocompleteChangeReason,
  AutocompleteChangeDetails,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import 'react-day-picker/dist/style.css';
import SingleDatePicker from '@/components/SingleDatePicker/SingleDatePicker';
import { useQueryParams } from '@/hooks/useQueryParams';
import useUpdateEffect from '@/hooks/useUpdateHook';
import Snackbar from '@mui/material/Snackbar';
import styles from './index.module.css'
import { useRouter } from 'next/router';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export enum ComboTypesEnum {
  origin = "origin",
  intermediate = "intermediate",
  destination = "destination",
}


interface ISelectedComboValue {
  origin:AutocompleteValue | null,
  intermediate:Array<AutocompleteValue>,
  destination:AutocompleteValue | null
}

type AutocompleteValue = string | null;

type EventChange = SyntheticEvent<Element, Event>;

const initOptions = {
  [ComboTypesEnum.origin]:[],
  [ComboTypesEnum.intermediate]:[],
  [ComboTypesEnum.destination]:[],
 }

 const Home = () =>  {
  //Custom Hooks
   const router = useRouter();
  const {queryParams, setQueryParams}= useQueryParams() as any;

  //Local State
  const [comboInputValue, setComboInputValue] = useState({
    [ComboTypesEnum.origin]:"",
    [ComboTypesEnum.intermediate]:"",
    [ComboTypesEnum.destination]:"",
  });

  const [comboSelectedValue, setComboSelectedValue] = useState<ISelectedComboValue>({
    [ComboTypesEnum.origin]:"",
    [ComboTypesEnum.intermediate]:[],
    [ComboTypesEnum.destination]:"",
  });

  const [options, setOptions] = useState(initOptions);
   
   const [activeCombo, setActiveCombo] = useState(ComboTypesEnum.origin);
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [passengers, setPassengers] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmiting, setIsSubmitting] = useState<boolean>(false);
  const [debounced] = useDebounce(comboInputValue[activeCombo], 1000);
 
  const [alertVisible, showAlert] = useState(false);
  const [errMsg, setErrMsg] = useState("");


  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    showAlert(false);
  };

    //methods
    const fetchCities = async (query:string, cb:Function) =>  {
      setLoading(true);
      return fetch(`http://localhost:3000/api/search?key=${query}`)
      .then(async response => {
        const data = await response.json();
        setLoading(false);
        if(response.ok) cb(data);
        else {
          setErrMsg(data.message)
          showAlert(true)
        }
      })
      .catch(err => {
        console.log('http err!')
      })
    }

    // Submitting form
    const handleSubmit = (e) => {
      e.preventDefault();
      const {origin, intermediate, destination} = comboSelectedValue;
      const citiesName = [origin, destination, ...intermediate];
      setIsSubmitting(true);
      fetch(`http://localhost:3000/api/calculate`,{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(citiesName),
     })
      .then(async response => {
        const data = await response.json();
        setIsSubmitting(false);
        if(response.ok) {
          router.push({ pathname: "/result", query:{...queryParams,distance:data} })
        }
        else {
          setErrMsg(data.message)
          showAlert(true)
        }
      })
      .catch(err => {
        console.log('http err!')
      })

    };

    const onChangeComboInputValue = (name:string) => (e:EventChange, val:string) => {
      setComboInputValue({
            ...comboInputValue,
            [name]: val,
        });
    }

    const onChangeComboSelectedValue = (name:string) => (event: EventChange | undefined, val: AutocompleteValue | AutocompleteValue[], reason?:AutocompleteChangeReason, details?:AutocompleteChangeDetails<AutocompleteValue>| undefined) => {
      setComboSelectedValue({
        ...comboSelectedValue,
        [name]: reason && reason === "removeOption"? comboSelectedValue.intermediate.filter(v => v !== details!.option):val,
    });
    }

 

    const handleOptions = (newOptions:Array<string>) => {
      setOptions({
        ...options,
        [activeCombo]:newOptions
      })
    }

    const onComboFocus = (name: ComboTypesEnum) => () => {
      fetchCities("", handleOptions);
      setActiveCombo(name);
      
    }

    const handleChangePassengers = (e: EventChange) => {
      const value = parseInt(e.target.value);
        if(value > 0){
          setPassengers(value)
        }
    }

  //React Hooks
    useEffect(() => {
      fetchCities(debounced, handleOptions);
     } ,[debounced]);

     useEffect(() => {
      fetchCities("", (newOptions) => {
        setOptions({
          ...options,
          [ComboTypesEnum.origin]:newOptions,
          [ComboTypesEnum.intermediate]:newOptions,
          [ComboTypesEnum.destination]:newOptions,
        })
      });
     } ,[]);

     useUpdateEffect(() => {
      const query = {
        origin: comboSelectedValue.origin,
        destination:comboSelectedValue.destination,
        intermediate:JSON.stringify(comboSelectedValue.intermediate),
        date:JSON.stringify(date),
        passengers
      }
      setQueryParams(query)
     } ,[comboSelectedValue, date, passengers])

     useEffect(() => {
      if(Object.keys(queryParams).length){ 
        if(passengers === 1 && !comboSelectedValue.origin && !comboSelectedValue.destination && !comboSelectedValue.intermediate.length && date === undefined) {
          setComboSelectedValue({
            ...comboSelectedValue,
            [ComboTypesEnum.origin]:queryParams.origin,
            [ComboTypesEnum.destination]:queryParams.destination,
            [ComboTypesEnum.intermediate]: JSON.parse(queryParams.intermediate)
        });
         setPassengers(queryParams.passengers);
         setDate(queryParams.date? new Date(JSON.parse(queryParams.date)): undefined);
      }
    }
     } ,[queryParams])


     useUpdateEffect(() => {
      const { origin, intermediate, destination} = comboSelectedValue;
        if(intermediate.includes(origin) || intermediate.includes(destination)){
          setComboSelectedValue({
            ...comboSelectedValue,
            [ComboTypesEnum.intermediate]: intermediate.filter(v => (v !== origin && v !== destination))
        });
        }
     } ,[comboSelectedValue])

     const submitDisabled = useMemo(() => {
      return !date || !comboSelectedValue.origin || !comboSelectedValue.destination || isSubmiting
     } ,[date, comboSelectedValue, isSubmiting]);

    return (
      <main> 
            <form onSubmit={handleSubmit}>
                <Grid className={styles.container} container spacing={5} alignItems="center" justifyContent="center" direction="column" >
                    <h1>Search to know the distance of a route</h1>
                    <Grid item>
                    <Autocomplete
                         id="combo-box-origin"
                         sx={{ width: 400 }}
                         value={comboSelectedValue.origin}
                         loading={loading}
                         inputValue={comboInputValue.origin}
                         onChange={onChangeComboSelectedValue(ComboTypesEnum.origin)}
                         onInputChange={onChangeComboInputValue(ComboTypesEnum.origin)}
                         onFocus={onComboFocus(ComboTypesEnum.origin)}
                         options={options[ComboTypesEnum.origin]?.filter(o => o !== comboSelectedValue.destination)}
                         renderInput={(params) => <TextField {...params} label="Origin City" />}
                       />
                    </Grid>
                    <Grid item>
                    <Autocomplete
                         id="combo-box-intermediate"
                         sx={{ width: 400 }}
                         multiple
                         value={comboSelectedValue.intermediate}
                         loading={loading}
                         inputValue={comboInputValue.intermediate}
                         onChange={onChangeComboSelectedValue(ComboTypesEnum.intermediate)}
                         onInputChange={onChangeComboInputValue(ComboTypesEnum.intermediate)}
                         onFocus={onComboFocus(ComboTypesEnum.intermediate)}
                         options={options[ComboTypesEnum.intermediate]?.filter(o => o !== comboSelectedValue.origin && o !== comboSelectedValue.destination)}
                         renderInput={(params) => <TextField {...params} label="Intermediate Cities" />}
                          />
                    </Grid>

                    <Grid item>
                    <Autocomplete
                         id="combo-box-destination"
                         sx={{ width: 400 }}
                         value={comboSelectedValue.destination}
                         loading={loading}
                         inputValue={comboInputValue.destination}
                         onChange={onChangeComboSelectedValue(ComboTypesEnum.destination)}
                         onInputChange={onChangeComboInputValue(ComboTypesEnum.destination)}
                         onFocus={onComboFocus(ComboTypesEnum.destination)}
                         options={options[ComboTypesEnum.destination]?.filter(o => o !== comboSelectedValue.origin)}
                         renderInput={(params) => <TextField {...params} label="Destination City" />}
                       />
                    </Grid>

                    <Grid item>
                        <SingleDatePicker 
                           value={date}
                           onDateSelection={setDate}
                          />
                    </Grid>
 
                    <Grid item>
                    <TextField
                           sx={{ width: 400 }}
                            id="Passengers"
                            name="Passengers"
                            label="Passengers"
                            type="number"
                            value={passengers}
                            onChange={handleChangePassengers}
                        />
                    </Grid>
                    <Grid item>
                        <Button disabled={submitDisabled} className={styles.submitBtn} variant="contained" color="primary" type="submit">
                          {isSubmiting? 'Loading ...':'Search'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
               anchorOrigin={{ vertical:'top', horizontal:'right' }}
                open={alertVisible}
                autoHideDuration={2000}
                onClose={handleClose}
                >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {errMsg}
                </Alert>
               </Snackbar>
            </main>
    );
}
export default Home;

