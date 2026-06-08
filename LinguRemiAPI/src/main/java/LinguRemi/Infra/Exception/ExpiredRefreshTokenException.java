package LinguRemi.Infra.Exception;

public class ExpiredRefreshTokenException extends RuntimeException {
    public ExpiredRefreshTokenException(String message)
    {
      super(message);
    }
}
