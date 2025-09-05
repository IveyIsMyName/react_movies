import Movie from "./Movie";
import './MovieList.css';

function MovieList(props)
{
    const {movies = []} = props;

    return(
        <div className="movies">
            {
                movies.map
                (
                    movie =>
                    {
                        return <Movie key={movie.imbdID} {...movie} />
                    }
                )
            }
        </div>
    )
}

export default MovieList;