FROM public.ecr.aws/lambda/nodejs:14@sha256:3fdbba8fa51795eb04c8901c09fe81a793dc23ee0ac866fbcb116590b877fe0c
WORKDIR /var/task/
RUN npm i -g yarn
COPY main.js main.js.map package.json yarn.lock assets/ ./
RUN yarn --prod --frozen-lockfile
CMD ["main.handler"]
