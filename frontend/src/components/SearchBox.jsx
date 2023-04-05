
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Form,
    FormControl,
    InputGroup,
    Button
} from 'react-bootstrap';





function SearchBox() {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    
    const submitHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
    };



    //RENDERED ELEMENT:
    return (
    <Form
    className= "d-flex me-auto"
    onSubmit={submitHandler}
    >
        <InputGroup>
            <FormControl
            type='text'
            name='q'
            id='q'
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Rechercher'
            arial-label='Search Products'
            aria-describedby='button-search'
            />
            <Button
            variant="outline-primary"
            type='submit'
            id='button-search'
            >
                <i className='fas fa-search'></i>
            </Button>
        </InputGroup>
    </Form>
    )
}

export default SearchBox
