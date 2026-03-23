import torch
from docling.document_converter import DocumentConverter
from docling.chunking import HybridChunker
import psycopg2
from pgvector.psycopg2 import register_vector
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os
import tempfile
from psycopg2.extras import execute_values
from typing import Dict, List

load_dotenv()

TABLE_NAME = "practical_guide_vectors"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

conn = psycopg2.connect(
    database=os.getenv("POSTGRES_DB"),
    user=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_HOST"),
    port=os.getenv("POSTGRES_PORT"),
)

# connect to a pg vector database
cur = conn.cursor()
cur.execute("CREATE EXTENSION IF NOT EXISTS vector")

register_vector(conn)

cur.execute("SELECT id, html, title, description FROM practical_guides")
practical_guides = cur.fetchall()


def html_to_docling_doc(html: str):
    with tempfile.NamedTemporaryFile(mode="w", suffix=".html", delete=True) as f:
        f.write(html)
        f.flush()
        converter = DocumentConverter()
        result = converter.convert(f.name)
        return result.document


if __name__ == "__main__":
    modelEmbedding = SentenceTransformer("all-MiniLM-L6-v2")
    chunker = HybridChunker(
        target_chunk_size=350,
        chunk_overlap=60,
    )

    rows: List[Dict[str, str]] = []

    for i, guide in enumerate(practical_guides):
        doc_id = str(guide[0])
        docling_doc = html_to_docling_doc(guide[1])
        title = guide[2]
        description = guide[3]
        chunks = list(chunker.chunk(docling_doc))
        serialized_chunks = [chunker.contextualize(chunk) for chunk in chunks]

        for doc in serialized_chunks:
            rows.append((doc_id, doc))

    if not rows:
        print("No chunks produced. Check conversion/chunking.")

    # Create embeddings from the serialized chunks
    texts = [r[1] for r in rows]
    embeddings = modelEmbedding.encode(texts, device=DEVICE, show_progress_bar=True)

    dim = embeddings.shape[1]

    # Ensure extension
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # Drop + create table (same as your script, but with doc_id + chunk_index)
    cur.execute(f"DROP TABLE IF EXISTS {TABLE_NAME}")
    cur.execute(
        f"""
        CREATE TABLE {TABLE_NAME} (
            id bigserial PRIMARY KEY,
            doc_id text NOT NULL,
            chunk_index int NOT NULL,
            embedding vector({dim}) NOT NULL,
            text text NOT NULL
        )
        """
    )

    # cur.execute(f"CREATE INDEX ON {TABLE_NAME} (doc_id)")
    # # Choose one index type; ivfflat needs ANALYZE and enough rows. Keep minimal:
    # cur.execute(f"CREATE INDEX ON {TABLE_NAME} USING hnsw (embedding vector_cosine_ops)")

    # Bulk insert
    values = []
    for i, ((doc_id, txt), emb) in enumerate(zip(rows, embeddings)):
        values.append((doc_id, i, emb.tolist(), txt))

    execute_values(
        cur,
        f"INSERT INTO {TABLE_NAME} (doc_id, chunk_index, embedding, text) VALUES %s",
        values,
        page_size=500,
    )

    # Old insertion method
    # for i, embedding in enumerate(embeddings):
    #     cur.execute('INSERT INTO practical_guide_vectors (embedding, text) VALUES (%s, %s)', (embedding.tolist(), serialized_chunks[i]))

    conn.commit()


# def retrieve(query):
#     query_embedding = modelEmbedding.encode(query, device=DEVICE)
#     cur.execute('SELECT id, embedding, text FROM tonio_items ORDER BY embedding <-> %s::vector LIMIT 10', (query_embedding.tolist(),))
#     rows = cur.fetchall()

#     rowsRanked = modelRanker.rank(query, [row[2] for row in rows], return_documents=True)
#     for rank in rowsRanked:
#         print(f"- #{rank['corpus_id']} ({rank['score']:.2f})")
#     return [row['text'] for row in rowsRanked]
