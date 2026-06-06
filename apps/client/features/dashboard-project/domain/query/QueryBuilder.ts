export class QueryBuilder {
    private readonly params = new URLSearchParams();

    paginate(page: number, limit: number) {
        this.params.append("page", String(page));
        this.params.append('limit', String(limit));
        return this;
    };

    search(value: string) {
        this.params.append('search', value);
        return this;
    }

    build() {
        return this.params.toString();
    }
}