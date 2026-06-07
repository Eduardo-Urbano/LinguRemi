package LinguRemi.Infra.Security;

public class RequestData {

    private int count;
    private long firstRequestTime;

    public RequestData() {
        this.count = 1;
        this.firstRequestTime = System.currentTimeMillis();
    }

    public int getCount() {
        return count;
    }

    public void increment() {
        this.count++;
    }

    public long getFirstRequestTime() {
        return firstRequestTime;
    }

    public void reset() {
        this.count = 1;
        this.firstRequestTime = System.currentTimeMillis();
    }
}